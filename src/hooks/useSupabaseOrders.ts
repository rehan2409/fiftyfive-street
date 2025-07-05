
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Order } from '@/store/useStore';

export const useOrders = () => {
  return useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data.map(order => ({
        id: order.id,
        items: order.items as any, // Cast Json to CartItem[]
        total: order.total,
        discount: order.discount || 0,
        couponCode: order.coupon_code,
        customerInfo: order.customer_info as any, // Cast Json to customer info object
        paymentProof: order.payment_proof,
        status: order.status as Order['status'],
        createdAt: order.created_at
      })) as Order[];
    },
  });
};

export const useAddOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (order: Omit<Order, 'id' | 'createdAt'>) => {
      const { data, error } = await supabase
        .from('orders')
        .insert([{
          items: order.items as any,
          total: order.total,
          discount: order.discount,
          coupon_code: order.couponCode,
          customer_info: order.customerInfo as any,
          payment_proof: order.paymentProof,
          status: order.status
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: Order['status'] }) => {
      const { data, error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};
