
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useStore } from '@/store/useStore';
import { Eye, Download } from 'lucide-react';

const RecentOrdersTable = () => {
  const { orders, updateOrderStatus } = useStore();

  const getStatusColor = (status: string) => {
    const colors = {
      'Processing': 'bg-yellow-100 text-yellow-800',
      'Packed': 'bg-blue-100 text-blue-800',
      'Out for Delivery': 'bg-purple-100 text-purple-800',
      'Delivered': 'bg-green-100 text-green-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const handleStatusChange = (orderId: string, newStatus: any) => {
    updateOrderStatus(orderId, newStatus);
  };

  return (
    <Card className="animate-fade-in-up">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Recent Orders
          <Button variant="outline" size="sm" className="animate-fade-in">
            View All
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {orders.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No orders found</p>
            <p className="text-sm mt-2">Orders will appear here when customers make purchases</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.slice(0, 10).map((order, index) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-all duration-300 transform hover:scale-[1.02] animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center space-x-4">
                  <div>
                    <p className="font-semibold">{order.id}</p>
                    <p className="text-sm text-gray-600">{order.customerInfo.name}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="font-semibold">₹{order.total}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className="px-2 py-1 border rounded text-sm"
                  >
                    <option value="Processing">Processing</option>
                    <option value="Packed">Packed</option>
                    <option value="Out for Delivery">Out for Delivery</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                  
                  <Badge className={getStatusColor(order.status)}>
                    {order.status}
                  </Badge>
                  
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="hover:scale-110 transition-transform">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="hover:scale-110 transition-transform">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentOrdersTable;
