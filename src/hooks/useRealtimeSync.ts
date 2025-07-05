
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useRealtimeSync = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    console.log('Setting up real-time sync...');

    // Subscribe to products changes
    const productsChannel = supabase
      .channel('products-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'products'
        },
        (payload) => {
          console.log('Products table changed:', payload);
          queryClient.invalidateQueries({ queryKey: ['products'] });
        }
      )
      .subscribe((status) => {
        console.log('Products channel status:', status);
      });

    // Subscribe to orders changes
    const ordersChannel = supabase
      .channel('orders-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders'
        },
        (payload) => {
          console.log('Orders table changed:', payload);
          queryClient.invalidateQueries({ queryKey: ['orders'] });
        }
      )
      .subscribe((status) => {
        console.log('Orders channel status:', status);
      });

    // Subscribe to coupons changes
    const couponsChannel = supabase
      .channel('coupons-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'coupons'
        },
        (payload) => {
          console.log('Coupons table changed:', payload);
          queryClient.invalidateQueries({ queryKey: ['coupons'] });
        }
      )
      .subscribe((status) => {
        console.log('Coupons channel status:', status);
      });

    // Subscribe to app settings changes
    const settingsChannel = supabase
      .channel('settings-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'app_settings'
        },
        (payload) => {
          console.log('App settings changed:', payload);
          queryClient.invalidateQueries({ queryKey: ['payment-qr'] });
          queryClient.invalidateQueries({ queryKey: ['admin-settings'] });
        }
      )
      .subscribe((status) => {
        console.log('Settings channel status:', status);
      });

    console.log('Real-time sync channels established');

    return () => {
      console.log('Cleaning up real-time sync...');
      supabase.removeChannel(productsChannel);
      supabase.removeChannel(ordersChannel);
      supabase.removeChannel(couponsChannel);
      supabase.removeChannel(settingsChannel);
    };
  }, [queryClient]);
};
