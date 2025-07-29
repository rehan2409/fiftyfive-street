
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useProducts } from '@/hooks/useSupabaseProducts';
import { useOrders } from '@/hooks/useSupabaseOrders';
import { useRealtimeSync } from '@/hooks/useRealtimeSync';
import DashboardStats from '@/components/admin/DashboardStats';
import RecentOrdersTable from '@/components/admin/RecentOrdersTable';
import ProductManagement from '@/components/admin/ProductManagement';
import CouponManagement from '@/components/admin/CouponManagement';
import QRCodeManagement from '@/components/admin/QRCodeManagement';
import AdminSettings from '@/components/admin/AdminSettings';
import ProjectDocumentation from '@/components/admin/ProjectDocumentation';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Download, Bell, Settings, Package, Tag, QrCode, ShoppingCart, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AdminDashboard = () => {
  const { data: products = [], isLoading: productsLoading } = useProducts();
  const { data: orders = [], isLoading: ordersLoading } = useOrders();
  const [activeTab, setActiveTab] = useState('overview');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { toast } = useToast();

  // Enable real-time sync
  useRealtimeSync();

  // Calculate real data from Supabase
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = orders.length;
  const totalProducts = products.length;

  // Handle export functionality
  const handleExport = () => {
    try {
      const exportData = {
        products,
        orders,
        exportDate: new Date().toISOString(),
        summary: {
          totalProducts,
          totalOrders,
          totalRevenue
        }
      };

      const dataStr = JSON.stringify(exportData, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `admin-data-${new Date().toISOString().split('T')[0]}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();

      toast({
        title: "Export Successful",
        description: "Admin data has been exported successfully.",
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export Failed",
        description: "There was an error exporting the data. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle notification button click
  const handleNotifications = () => {
    toast({
      title: "Notifications",
      description: "You have no new notifications at the moment.",
    });
  };

  // Handle settings button click
  const handleSettings = () => {
    setIsSettingsOpen(true);
  };

  // Generate chart data from real orders
  const last6Months = [];
  const today = new Date();
  
  for (let i = 5; i >= 0; i--) {
    const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const monthName = date.toLocaleString('default', { month: 'short' });
    const monthOrders = orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      return orderDate.getMonth() === date.getMonth() && orderDate.getFullYear() === date.getFullYear();
    });
    
    last6Months.push({
      month: monthName,
      revenue: monthOrders.reduce((sum, order) => sum + order.total, 0),
      orders: monthOrders.length
    });
  }

  // Calculate category distribution from products
  const categoryData = [
    { 
      name: 'T-Shirts', 
      value: products.filter(p => p.category === 'T-Shirts').length,
      color: '#8884d8' 
    },
    { 
      name: 'Cargos', 
      value: products.filter(p => p.category === 'Cargos').length,
      color: '#82ca9d' 
    },
    { 
      name: 'Jackets', 
      value: products.filter(p => p.category === 'Jackets').length,
      color: '#ffc658' 
    },
  ].filter(item => item.value > 0);

  // Show loading state
  if (productsLoading || ordersLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 animate-fade-in">
      {/* Header */}
      <div className="mb-8 animate-slide-in-left">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your store.</p>
            <p className="text-sm text-gray-500 mt-1">
              Products: {totalProducts} | Orders: {totalOrders} | Revenue: ₹{totalRevenue.toFixed(2)}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              className="animate-fade-in hover:scale-105 transition-transform"
              onClick={handleNotifications}
            >
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </Button>
            <Button 
              variant="outline" 
              className="animate-fade-in hover:scale-105 transition-transform"
              onClick={handleSettings}
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview" className="flex items-center space-x-2">
            <ShoppingCart className="h-4 w-4" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger value="products" className="flex items-center space-x-2">
            <Package className="h-4 w-4" />
            <span>Products</span>
          </TabsTrigger>
          <TabsTrigger value="coupons" className="flex items-center space-x-2">
            <Tag className="h-4 w-4" />
            <span>Coupons</span>
          </TabsTrigger>
          <TabsTrigger value="qr-code" className="flex items-center space-x-2">
            <QrCode className="h-4 w-4" />
            <span>QR Code</span>
          </TabsTrigger>
          <TabsTrigger value="orders" className="flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>Orders</span>
          </TabsTrigger>
          <TabsTrigger value="documentation" className="flex items-center space-x-2">
            <FileText className="h-4 w-4" />
            <span>Documentation</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Stats Cards */}
          <DashboardStats />

          {/* Charts Section */}
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            {/* Revenue Chart */}
            <Card className="animate-fade-in-up hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Revenue Overview
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="hover:scale-105 transition-transform"
                    onClick={handleExport}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {last6Months.some(month => month.revenue > 0) ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={last6Months}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#f8f9fa', 
                          border: '1px solid #dee2e6',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                      <Bar dataKey="revenue" fill="#000000" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-gray-500">
                    No revenue data available
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Orders Trend */}
            <Card className="animate-fade-in-up hover:shadow-lg transition-shadow" style={{ animationDelay: '0.1s' }}>
              <CardHeader>
                <CardTitle>Orders Trend</CardTitle>
              </CardHeader>
              <CardContent>
                {last6Months.some(month => month.orders > 0) ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={last6Months}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#f8f9fa', 
                          border: '1px solid #dee2e6',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="orders" 
                        stroke="#000000" 
                        strokeWidth={3}
                        dot={{ fill: '#000000', strokeWidth: 2, r: 6 }}
                        activeDot={{ r: 8, stroke: '#000000', strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-gray-500">
                    No orders data available
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Bottom Section */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Recent Orders */}
            <div className="lg:col-span-2">
              <RecentOrdersTable />
            </div>

            {/* Category Distribution */}
            <Card className="animate-fade-in-up hover:shadow-lg transition-shadow" style={{ animationDelay: '0.2s' }}>
              <CardHeader>
                <CardTitle>Category Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                {categoryData.length > 0 ? (
                  <>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${value}`}
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    
                    <div className="mt-4 space-y-2">
                      {categoryData.map((item, index) => (
                        <div 
                          key={item.name} 
                          className="flex items-center justify-between p-2 bg-gray-50 rounded animate-fade-in"
                          style={{ animationDelay: `${index * 0.1}s` }}
                        >
                          <div className="flex items-center space-x-2">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: item.color }}
                            ></div>
                            <span className="text-sm font-medium">{item.name}</span>
                          </div>
                          <span className="text-sm text-gray-600">{item.value} products</span>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-gray-500">
                    No products available
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="products">
          <ProductManagement />
        </TabsContent>

        <TabsContent value="coupons">
          <CouponManagement />
        </TabsContent>

        <TabsContent value="qr-code">
          <QRCodeManagement />
        </TabsContent>

        <TabsContent value="orders">
          <RecentOrdersTable />
        </TabsContent>

        <TabsContent value="documentation">
          <ProjectDocumentation />
        </TabsContent>
      </Tabs>

      {/* Settings Modal */}
      <AdminSettings 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />
    </div>
  );
};

export default AdminDashboard;
