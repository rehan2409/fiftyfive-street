import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useOrders } from '@/hooks/useSupabaseOrders';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { MapPin } from 'lucide-react';

const COLORS = ['#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#6366F1', '#EF4444', '#14B8A6', '#F97316', '#84CC16'];

const RegionalAnalytics = () => {
  const { data: orders = [] } = useOrders();

  // Extract region (city/state/pincode) from customer_info
  const regionMap = new Map<string, { orders: number; revenue: number }>();

  orders.forEach((order) => {
    const info = order.customerInfo as any;
    // Try to get city, fallback to pincode area
    const region = info?.city || info?.state || (info?.pincode ? `PIN ${String(info.pincode).substring(0, 3)}xxx` : 'Unknown');
    
    const existing = regionMap.get(region) || { orders: 0, revenue: 0 };
    regionMap.set(region, {
      orders: existing.orders + 1,
      revenue: existing.revenue + (order.total || 0),
    });
  });

  const regionData = Array.from(regionMap.entries())
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 10);

  const totalOrders = orders.length;

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Revenue by Region */}
        <Card className="bg-white/80 backdrop-blur-sm border border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-blue-500" />
              Revenue by Region
            </CardTitle>
          </CardHeader>
          <CardContent>
            {regionData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={regionData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} />
                  <Tooltip
                    formatter={(value: number) => [`₹${value.toFixed(0)}`, 'Revenue']}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
                  />
                  <Bar dataKey="revenue" fill="url(#regionGradient)" radius={[0, 4, 4, 0]} />
                  <defs>
                    <linearGradient id="regionGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.8} />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                No regional data available. Add city/state fields to checkout.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Orders Distribution by Region */}
        <Card className="bg-white/80 backdrop-blur-sm border border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-purple-500" />
              Orders Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            {regionData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={regionData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="orders"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {regionData.map((_, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-2 space-y-1">
                  {regionData.map((item, i) => (
                    <div key={item.name} className="flex items-center justify-between text-sm p-1.5 rounded bg-muted/30">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                        <span>{item.name}</span>
                      </div>
                      <div className="flex gap-4 text-muted-foreground">
                        <span>{item.orders} orders</span>
                        <span>₹{item.revenue.toFixed(0)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                No regional data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RegionalAnalytics;
