
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface TargetedCoupon {
  id: string;
  customerEmail: string;
  code: string;
  type: 'percentage' | 'flat';
  value: number;
  minPurchase: number;
  maxDiscount: number | null;
  expiryDate: string;
  active: boolean;
  used: boolean;
  usedAt: string | null;
  message: string;
  createdAt: string;
}

const mapRow = (row: any): TargetedCoupon => ({
  id: row.id,
  customerEmail: row.customer_email,
  code: row.code,
  type: row.type as 'percentage' | 'flat',
  value: row.value,
  minPurchase: row.min_purchase,
  maxDiscount: row.max_discount,
  expiryDate: row.expiry_date,
  active: row.active,
  used: row.used,
  usedAt: row.used_at,
  message: row.message,
  createdAt: row.created_at,
});

export const useAllTargetedCoupons = () => {
  return useQuery({
    queryKey: ['targeted-coupons'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('targeted_coupons')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []).map(mapRow);
    },
  });
};

export const useCustomerTargetedCoupons = (email: string | undefined) => {
  return useQuery({
    queryKey: ['targeted-coupons', 'customer', email],
    enabled: !!email,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('targeted_coupons')
        .select('*')
        .eq('customer_email', email!)
        .eq('active', true)
        .eq('used', false)
        .gte('expiry_date', new Date().toISOString());
      if (error) throw error;
      return (data || []).map(mapRow);
    },
  });
};

export const useCreateTargetedCoupon = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (coupon: {
      customerEmail: string;
      code: string;
      type: 'percentage' | 'flat';
      value: number;
      minPurchase: number;
      maxDiscount: number | null;
      expiryDate: string;
      message: string;
    }) => {
      const { data, error } = await supabase
        .from('targeted_coupons')
        .insert([{
          customer_email: coupon.customerEmail,
          code: coupon.code,
          type: coupon.type,
          value: coupon.value,
          min_purchase: coupon.minPurchase,
          max_discount: coupon.maxDiscount,
          expiry_date: coupon.expiryDate,
          message: coupon.message,
        }])
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['targeted-coupons'] });
    },
  });
};

export const useDeleteTargetedCoupon = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('targeted_coupons')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['targeted-coupons'] });
    },
  });
};

export const useToggleTargetedCoupon = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, active }: { id: string; active: boolean }) => {
      const { error } = await supabase
        .from('targeted_coupons')
        .update({ active })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['targeted-coupons'] });
    },
  });
};

export const useMarkTargetedCouponUsed = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('targeted_coupons')
        .update({ used: true, used_at: new Date().toISOString() })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['targeted-coupons'] });
    },
  });
};
