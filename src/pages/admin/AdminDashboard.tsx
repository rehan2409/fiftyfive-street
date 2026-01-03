
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

import AdminSettings from '@/components/admin/AdminSettings';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Download, Bell, Settings, Package, Tag, ShoppingCart, Shield } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-6 animate-fade-in">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="h-full w-full bg-[radial-gradient(circle_at_1px_1px,rgba(59,130,246,0.15)_1px,transparent_0)] bg-[length:20px_20px]"></div>
      </div>

      {/* Header */}
      <div className="relative mb-8 animate-slide-in-left">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Admin Control Center
                </h1>
                <p className="text-gray-600 mt-1">Complete store management & analytics</p>
                <div className="flex items-center space-x-4 mt-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {totalProducts} Products
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {totalOrders} Orders
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    ₹{totalRevenue.toFixed(2)} Revenue
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button 
                variant="outline" 
                className="bg-white/50 border-blue-200 text-blue-700 hover:bg-blue-50 hover:scale-105 transition-all duration-200 shadow-sm"
                onClick={handleNotifications}
              >
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </Button>
              <Button 
                variant="outline" 
                className="bg-white/50 border-purple-200 text-purple-700 hover:bg-purple-50 hover:scale-105 transition-all duration-200 shadow-sm"
                onClick={handleSettings}
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="relative">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg rounded-xl p-1">
            <TabsTrigger 
              value="overview" 
              className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-lg transition-all duration-200 hover:scale-105"
            >
              <ShoppingCart className="h-4 w-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger 
              value="products" 
              className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-blue-600 data-[state=active]:text-white rounded-lg transition-all duration-200 hover:scale-105"
            >
              <Package className="h-4 w-4" />
              <span>Products</span>
            </TabsTrigger>
            <TabsTrigger 
              value="coupons" 
              className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-600 data-[state=active]:text-white rounded-lg transition-all duration-200 hover:scale-105"
            >
              <Tag className="h-4 w-4" />
              <span>Coupons</span>
            </TabsTrigger>
            <TabsTrigger 
              value="orders" 
              className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-lg transition-all duration-200 hover:scale-105"
            >
              <Settings className="h-4 w-4" />
              <span>Orders</span>
            </TabsTrigger>
          </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Stats Cards */}
          <DashboardStats />

          {/* Charts Section */}
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            {/* Revenue Chart */}
            <Card className="animate-fade-in-up hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm border border-white/20">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-lg">
                <CardTitle className="flex items-center justify-between text-gray-800">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <Download className="h-4 w-4 text-white" />
                    </div>
                    <span>Revenue Analytics</span>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="bg-white/50 border-blue-200 text-blue-700 hover:bg-blue-50 hover:scale-105 transition-all duration-200 shadow-sm"
                    onClick={handleExport}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export Data
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
                       <Bar dataKey="revenue" fill="url(#colorRevenue)" radius={[4, 4, 0, 0]} />
                       <defs>
                         <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                           <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                         </linearGradient>
                       </defs>
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

        <TabsContent value="orders">
          <RecentOrdersTable />
        </TabsContent>
      </Tabs>

      {/* Settings Modal */}
      <AdminSettings 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />
      </div>
    </div>
  );
};

export default AdminDashboard;
