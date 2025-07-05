
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const usePaymentQR = () => {
  return useQuery({
    queryKey: ['payment-qr'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('app_settings')
        .select('value')
        .eq('key', 'payment_qr_image')
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data?.value || null;
    },
  });
};

export const useUpdatePaymentQR = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (qrImage: string) => {
      const { data, error } = await supabase
        .from('app_settings')
        .upsert([{
          key: 'payment_qr_image',
          value: qrImage
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment-qr'] });
    },
  });
};
