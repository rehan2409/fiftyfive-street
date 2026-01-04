
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
        id: coupon.id,
        code: coupon.code,
        type: coupon.type as 'percentage' | 'flat',
        value: coupon.value,
        expiryDate: coupon.expiry_date,
        currentUsages: coupon.current_usages,
        maxUsages: coupon.max_usages,
        active: coupon.active,
        createdAt: coupon.created_at
      })) as Coupon[];
    },
  });
};

export const useAddCoupon = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (coupon: Omit<Coupon, 'id' | 'createdAt'>) => {
      // Only send snake_case column names that exist in the database
      const { data, error } = await supabase
        .from('coupons')
        .insert([{
          code: coupon.code,
          type: coupon.type,
          value: coupon.value,
          expiry_date: coupon.expiryDate,
          current_usages: coupon.currentUsages,
          max_usages: coupon.maxUsages,
          active: coupon.active
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
      // Convert camelCase to snake_case for database
      const dbUpdates: Record<string, any> = {};
      
      if (updates.code !== undefined) dbUpdates.code = updates.code;
      if (updates.type !== undefined) dbUpdates.type = updates.type;
      if (updates.value !== undefined) dbUpdates.value = updates.value;
      if (updates.expiryDate !== undefined) dbUpdates.expiry_date = updates.expiryDate;
      if (updates.currentUsages !== undefined) dbUpdates.current_usages = updates.currentUsages;
      if (updates.maxUsages !== undefined) dbUpdates.max_usages = updates.maxUsages;
      if (updates.active !== undefined) dbUpdates.active = updates.active;
      
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
