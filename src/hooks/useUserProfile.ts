import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface UserProfile {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  address: string | null;
  created_at: string;
  updated_at: string;
}

export const useUserProfile = (email: string | undefined) => {
  return useQuery({
    queryKey: ['user-profile', email],
    queryFn: async () => {
      if (!email) return null;
      
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('email', email)
        .maybeSingle();
      
      if (error) throw error;
      return data as UserProfile | null;
    },
    enabled: !!email,
  });
};

export const useUpsertUserProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (profile: { email: string; name: string; phone?: string; address?: string }) => {
      // Try to upsert - insert or update on conflict
      const { data, error } = await supabase
        .from('user_profiles')
        .upsert({
          email: profile.email,
          name: profile.name,
          phone: profile.phone || null,
          address: profile.address || null,
        }, {
          onConflict: 'email'
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['user-profile', variables.email] });
    },
  });
};
