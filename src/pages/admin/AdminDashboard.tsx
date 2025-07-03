
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useStore } from '@/store/useStore';
import DashboardStats from '@/components/admin/DashboardStats';
import RecentOrdersTable from '@/components/admin/RecentOrdersTable';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Download, Plus, Settings, Bell } from 'lucide-react';

const AdminDashboard = () => {
  const { products } = useStore();

  // Sample data for charts
  const salesData = [
    { month: 'Jan', revenue: 45000, orders: 120 },
    { month: 'Feb', revenue: 52000, orders: 150 },
    { month: 'Mar', revenue: 48000, orders: 130 },
    { month: 'Apr', revenue: 61000, orders: 180 },
    { month: 'May', revenue: 55000, orders: 160 },
    { month: 'Jun', revenue: 67000, orders: 200 },
  ];

  const categoryData = [
    { name: 'T-Shirts', value: 45, color: '#8884d8' },
    { name: 'Cargos', value: 35, color: '#82ca9d' },
    { name: 'Jackets', value: 20, color: '#ffc658' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6 animate-fade-in">
      {/* Header */}
      <div className="mb-8 animate-slide-in-left">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your store.</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" className="animate-fade-in hover:scale-105 transition-transform">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </Button>
            <Button variant="outline" className="animate-fade-in hover:scale-105 transition-transform">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Button className="bg-black text-white hover:bg-gray-800 animate-bounce-in hover:scale-105 transition-transform">
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <DashboardStats />

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue Chart */}
        <Card className="animate-fade-in-up hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Revenue Overview
              <Button variant="outline" size="sm" className="hover:scale-105 transition-transform">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesData}>
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
          </CardContent>
        </Card>

        {/* Orders Trend */}
        <Card className="animate-fade-in-up hover:shadow-lg transition-shadow" style={{ animationDelay: '0.1s' }}>
          <CardHeader>
            <CardTitle>Orders Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData}>
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
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
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
                  <span className="text-sm text-gray-600">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
