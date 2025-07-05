
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface AdminSettings {
  siteName: string;
  adminEmail: string;
  autoOrderConfirmation: boolean;
  lowStockAlerts: boolean;
  emailNotifications: boolean;
  maintenanceMode: boolean;
  allowGuestCheckout: boolean;
  orderNotificationDelay: number;
}

const defaultSettings: AdminSettings = {
  siteName: 'Bling Collective',
  adminEmail: 'admin@blingcollective.com',
  autoOrderConfirmation: true,
  lowStockAlerts: true,
  emailNotifications: true,
  maintenanceMode: false,
  allowGuestCheckout: true,
  orderNotificationDelay: 5,
};

export const useAdminSettings = () => {
  return useQuery({
    queryKey: ['admin-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('app_settings')
        .select('*')
        .in('key', [
          'site_name',
          'admin_email', 
          'auto_order_confirmation',
          'low_stock_alerts',
          'email_notifications',
          'maintenance_mode',
          'allow_guest_checkout',
          'order_notification_delay'
        ]);
      
      if (error) throw error;
      
      // Convert database format to settings object
      const settings = { ...defaultSettings };
      data.forEach(setting => {
        switch (setting.key) {
          case 'site_name':
            settings.siteName = setting.value || defaultSettings.siteName;
            break;
          case 'admin_email':
            settings.adminEmail = setting.value || defaultSettings.adminEmail;
            break;
          case 'auto_order_confirmation':
            settings.autoOrderConfirmation = setting.value === 'true';
            break;
          case 'low_stock_alerts':
            settings.lowStockAlerts = setting.value === 'true';
            break;
          case 'email_notifications':
            settings.emailNotifications = setting.value === 'true';
            break;
          case 'maintenance_mode':
            settings.maintenanceMode = setting.value === 'true';
            break;
          case 'allow_guest_checkout':
            settings.allowGuestCheckout = setting.value === 'true';
            break;
          case 'order_notification_delay':
            settings.orderNotificationDelay = parseInt(setting.value || '5');
            break;
        }
      });
      
      return settings;
    },
  });
};

export const useUpdateAdminSettings = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (settings: AdminSettings) => {
      const settingsArray = [
        { key: 'site_name', value: settings.siteName },
        { key: 'admin_email', value: settings.adminEmail },
        { key: 'auto_order_confirmation', value: settings.autoOrderConfirmation.toString() },
        { key: 'low_stock_alerts', value: settings.lowStockAlerts.toString() },
        { key: 'email_notifications', value: settings.emailNotifications.toString() },
        { key: 'maintenance_mode', value: settings.maintenanceMode.toString() },
        { key: 'allow_guest_checkout', value: settings.allowGuestCheckout.toString() },
        { key: 'order_notification_delay', value: settings.orderNotificationDelay.toString() },
      ];

      const { error } = await supabase
        .from('app_settings')
        .upsert(settingsArray);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-settings'] });
    },
  });
};
