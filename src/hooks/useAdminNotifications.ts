import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useProducts } from '@/hooks/useSupabaseProducts';

export interface AdminNotification {
  id: string;
  type: 'new_order' | 'out_of_stock' | 'low_stock';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  data?: Record<string, any>;
}

const STORAGE_KEY = 'admin_notifications';
const MAX_NOTIFICATIONS = 50;

const loadNotifications = (): AdminNotification[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveNotifications = (notifications: AdminNotification[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications.slice(0, MAX_NOTIFICATIONS)));
};

export const useAdminNotifications = () => {
  const [notifications, setNotifications] = useState<AdminNotification[]>(loadNotifications);
  const { data: products = [] } = useProducts();

  const addNotification = useCallback((notif: Omit<AdminNotification, 'id' | 'timestamp' | 'read'>) => {
    const newNotif: AdminNotification = {
      ...notif,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      read: false,
    };
    setNotifications(prev => {
      const updated = [newNotif, ...prev].slice(0, MAX_NOTIFICATIONS);
      saveNotifications(updated);
      return updated;
    });
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => {
      const updated = prev.map(n => n.id === id ? { ...n, read: true } : n);
      saveNotifications(updated);
      return updated;
    });
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => {
      const updated = prev.map(n => ({ ...n, read: true }));
      saveNotifications(updated);
      return updated;
    });
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
    saveNotifications([]);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Listen for new orders
  useEffect(() => {
    const channel = supabase
      .channel('admin-order-notifications')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'orders' },
        (payload) => {
          const order = payload.new as any;
          const customerInfo = order.customer_info as any;
          const customerName = customerInfo?.name || customerInfo?.email || 'A customer';
          addNotification({
            type: 'new_order',
            title: '🛒 New Order Placed!',
            message: `${customerName} placed an order worth ₹${order.total}`,
            data: { orderId: order.id, total: order.total },
          });
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [addNotification]);

  // Listen for stock changes (out of stock / low stock)
  useEffect(() => {
    const channel = supabase
      .channel('admin-stock-notifications')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'products' },
        (payload) => {
          const product = payload.new as any;
          const oldProduct = payload.old as any;

          if (product.stock <= 0 && (oldProduct.stock === undefined || oldProduct.stock > 0)) {
            addNotification({
              type: 'out_of_stock',
              title: '🚨 Product Out of Stock!',
              message: `"${product.name}" is now out of stock`,
              data: { productId: product.id, productName: product.name },
            });
          } else if (product.stock > 0 && product.stock <= 5 && (oldProduct.stock === undefined || oldProduct.stock > 5)) {
            addNotification({
              type: 'low_stock',
              title: '⚠️ Low Stock Alert',
              message: `"${product.name}" has only ${product.stock} left in stock`,
              data: { productId: product.id, productName: product.name, stock: product.stock },
            });
          }
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [addNotification]);

  // Check for existing out-of-stock products on load
  useEffect(() => {
    const outOfStockProducts = products.filter(p => (p.stock ?? 0) <= 0);
    const lowStockProducts = products.filter(p => (p.stock ?? 0) > 0 && (p.stock ?? 0) <= 5);

    // Only add initial alerts if there are no existing notifications (first load)
    const existingIds = new Set(notifications.map(n => n.data?.productId));

    outOfStockProducts.forEach(p => {
      if (!existingIds.has(p.id)) {
        addNotification({
          type: 'out_of_stock',
          title: '🚨 Product Out of Stock!',
          message: `"${p.name}" is currently out of stock`,
          data: { productId: p.id, productName: p.name },
        });
      }
    });

    lowStockProducts.forEach(p => {
      if (!existingIds.has(p.id)) {
        addNotification({
          type: 'low_stock',
          title: '⚠️ Low Stock Alert',
          message: `"${p.name}" has only ${p.stock} left in stock`,
          data: { productId: p.id, productName: p.name, stock: p.stock },
        });
      }
    });
    // Only run once when products load
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products.length]);

  return {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    clearAll,
  };
};
