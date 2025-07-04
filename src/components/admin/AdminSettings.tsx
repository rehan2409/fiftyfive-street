
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Save, RefreshCw, Shield, Bell, Palette, Database } from 'lucide-react';

interface AdminSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminSettings: React.FC<AdminSettingsProps> = ({ isOpen, onClose }) => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    siteName: 'Bling Collective',
    adminEmail: 'admin@blingcollective.com',
    autoOrderConfirmation: true,
    lowStockAlerts: true,
    emailNotifications: true,
    maintenanceMode: false,
    allowGuestCheckout: true,
    orderNotificationDelay: 5,
  });

  const handleSaveSettings = () => {
    // In a real app, this would send the settings to the backend
    toast({
      title: "Settings Saved",
      description: "Your admin settings have been updated successfully.",
    });
    onClose();
  };

  const handleResetSettings = () => {
    setSettings({
      siteName: 'Bling Collective',
      adminEmail: 'admin@blingcollective.com',
      autoOrderConfirmation: true,
      lowStockAlerts: true,
      emailNotifications: true,
      maintenanceMode: false,
      allowGuestCheckout: true,
      orderNotificationDelay: 5,
    });
    toast({
      title: "Settings Reset",
      description: "All settings have been reset to default values.",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Admin Settings</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* General Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Palette className="h-4 w-4" />
                <span>General Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="siteName">Site Name</Label>
                <Input
                  id="siteName"
                  value={settings.siteName}
                  onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="adminEmail">Admin Email</Label>
                <Input
                  id="adminEmail"
                  type="email"
                  value={settings.adminEmail}
                  onChange={(e) => setSettings({ ...settings, adminEmail: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Order Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="h-4 w-4" />
                <span>Order Management</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto Order Confirmation</Label>
                  <p className="text-sm text-gray-600">Automatically confirm orders when payment is received</p>
                </div>
                <Switch
                  checked={settings.autoOrderConfirmation}
                  onCheckedChange={(checked) => setSettings({ ...settings, autoOrderConfirmation: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Allow Guest Checkout</Label>
                  <p className="text-sm text-gray-600">Allow customers to checkout without creating an account</p>
                </div>
                <Switch
                  checked={settings.allowGuestCheckout}
                  onCheckedChange={(checked) => setSettings({ ...settings, allowGuestCheckout: checked })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="orderDelay">Order Notification Delay (minutes)</Label>
                <Input
                  id="orderDelay"
                  type="number"
                  min="0"
                  max="60"
                  value={settings.orderNotificationDelay}
                  onChange={(e) => setSettings({ ...settings, orderNotificationDelay: parseInt(e.target.value) || 0 })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-4 w-4" />
                <span>Notifications</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-gray-600">Receive email notifications for new orders</p>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => setSettings({ ...settings, emailNotifications: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Low Stock Alerts</Label>
                  <p className="text-sm text-gray-600">Get notified when products are running low</p>
                </div>
                <Switch
                  checked={settings.lowStockAlerts}
                  onCheckedChange={(checked) => setSettings({ ...settings, lowStockAlerts: checked })}
                />
              </div>
            </CardContent>
          </Card>

          {/* System Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-4 w-4" />
                <span>System Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Maintenance Mode</Label>
                  <p className="text-sm text-gray-600">Put the site in maintenance mode for updates</p>
                </div>
                <Switch
                  checked={settings.maintenanceMode}
                  onCheckedChange={(checked) => setSettings({ ...settings, maintenanceMode: checked })}
                />
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* Action Buttons */}
          <div className="flex space-x-2">
            <Button onClick={handleSaveSettings} className="flex-1">
              <Save className="h-4 w-4 mr-2" />
              Save Settings
            </Button>
            <Button variant="outline" onClick={handleResetSettings} className="flex-1">
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset to Default
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdminSettings;
