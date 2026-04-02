import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Review {
  id: string;
  product_id: string;
  customer_email: string;
  customer_name: string;
  rating: number;
  review_text: string | null;
  created_at: string;
}

export const useProductReviews = (productId?: string) => {
  return useQuery({
    queryKey: ['reviews', productId],
    queryFn: async () => {
      let query = supabase.from('reviews' as any).select('*');
      if (productId) {
        query = query.eq('product_id', productId);
      }
      const { data, error } = await query.order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []) as unknown as Review[];
    },
  });
};

export const useAllReviews = () => {
  return useQuery({
    queryKey: ['reviews', 'all'],
    queryFn: async () => {
      const { data, error } = await (supabase.from('reviews' as any) as any)
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []) as unknown as Review[];
    },
  });
};

export const useSubmitReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (review: { product_id: string; customer_email: string; customer_name: string; rating: number; review_text?: string }) => {
      const { data, error } = await (supabase.from('reviews' as any) as any).insert([review]).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
  });
};

export const useDeleteReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (reviewId: string) => {
      const { error } = await (supabase.from('reviews' as any) as any).delete().eq('id', reviewId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
  });
};
