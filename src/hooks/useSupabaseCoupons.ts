
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Coupon } from '@/store/useStore';

export const useCoupons = () => {
  return useQuery({
    queryKey: ['coupons'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data.map(coupon => ({
        ...coupon,
        expiryDate: coupon.expiry_date,
        currentUsages: coupon.current_usages,
        maxUsages: coupon.max_usages,
        createdAt: coupon.created_at
      })) as Coupon[];
    },
  });
};

export const useAddCoupon = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (coupon: Omit<Coupon, 'id' | 'createdAt'>) => {
      const { data, error } = await supabase
        .from('coupons')
        .insert([{
          ...coupon,
          expiry_date: coupon.expiryDate,
          current_usages: coupon.currentUsages,
          max_usages: coupon.maxUsages
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
    },
  });
};

export const useUpdateCoupon = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Coupon> }) => {
      const dbUpdates: any = { ...updates };
      if (updates.expiryDate) dbUpdates.expiry_date = updates.expiryDate;
      if (updates.currentUsages !== undefined) dbUpdates.current_usages = updates.currentUsages;
      if (updates.maxUsages !== undefined) dbUpdates.max_usages = updates.maxUsages;
      
      // Remove client-side field names
      delete dbUpdates.expiryDate;
      delete dbUpdates.currentUsages;
      delete dbUpdates.maxUsages;
      delete dbUpdates.createdAt;
      
      const { data, error } = await supabase
        .from('coupons')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
    },
  });
};

export const useDeleteCoupon = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('coupons')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
    },
  });
};
