
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface CustomerData {
  email: string;
  name: string;
  phone: string | null;
  address: string | null;
  signupDate: string;
  lastLogin: string | null;
  totalOrders: number;
  totalSpent: number;
  lastPurchaseDate: string | null;
  lastPurchaseProducts: string[];
  lastPurchaseValue: number;
  lastPurchaseStatus: string | null;
  isActive: boolean;
  isHighValue: boolean;
}

export const useCustomerData = () => {
  return useQuery({
    queryKey: ['admin-customers'],
    queryFn: async () => {
      // Fetch all user profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });
      if (profilesError) throw profilesError;

      // Fetch all orders
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      if (ordersError) throw ordersError;

      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      return (profiles || []).map((profile): CustomerData => {
        const customerOrders = (orders || []).filter((o: any) => {
          const info = o.customer_info as any;
          return info?.email === profile.email;
        });

        const totalSpent = customerOrders.reduce((sum: number, o: any) => sum + Number(o.total || 0), 0);
        const lastOrder = customerOrders[0]; // already sorted desc

        let lastPurchaseProducts: string[] = [];
        if (lastOrder) {
          const items = lastOrder.items as any[];
          if (Array.isArray(items)) {
            lastPurchaseProducts = items.map((i: any) => i.name || i.product?.name || 'Unknown').slice(0, 3);
          }
        }

        const lastLoginDate = profile.last_login ? new Date(profile.last_login) : null;
        const lastOrderDate = lastOrder ? new Date(lastOrder.created_at) : null;
        const signupDate = new Date(profile.created_at);

        // Active: logged in last 7 days or ordered last 30 days or signed up last 7 days
        const isActive = 
          (lastLoginDate && lastLoginDate > sevenDaysAgo) ||
          (lastOrderDate && lastOrderDate > thirtyDaysAgo) ||
          signupDate > sevenDaysAgo;

        const isHighValue = totalSpent >= 5000 || customerOrders.length >= 5;

        return {
          email: profile.email,
          name: profile.name,
          phone: profile.phone,
          address: profile.address,
          signupDate: profile.created_at,
          lastLogin: profile.last_login,
          totalOrders: customerOrders.length,
          totalSpent,
          lastPurchaseDate: lastOrder?.created_at || null,
          lastPurchaseProducts,
          lastPurchaseValue: lastOrder ? Number(lastOrder.total) : 0,
          lastPurchaseStatus: lastOrder?.status || null,
          isActive: !!isActive,
          isHighValue,
        };
      });
    },
  });
};
