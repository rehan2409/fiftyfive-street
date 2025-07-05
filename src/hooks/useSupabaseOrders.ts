
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
        ...order,
        customerInfo: order.customer_info,
        paymentProof: order.payment_proof,
        couponCode: order.coupon_code,
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
          ...order,
          customer_info: order.customerInfo,
          payment_proof: order.paymentProof,
          coupon_code: order.couponCode
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
