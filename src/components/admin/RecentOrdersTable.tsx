
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Download } from 'lucide-react';

interface Order {
  id: string;
  customer: string;
  amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  date: string;
}

const RecentOrdersTable = () => {
  const orders: Order[] = [
    {
      id: 'ORD-001',
      customer: 'John Doe',
      amount: 2500,
      status: 'delivered',
      date: '2025-01-15'
    },
    {
      id: 'ORD-002',
      customer: 'Jane Smith',
      amount: 1800,
      status: 'shipped',
      date: '2025-01-14'
    },
    {
      id: 'ORD-003',
      customer: 'Mike Johnson',
      amount: 3200,
      status: 'processing',
      date: '2025-01-13'
    },
    {
      id: 'ORD-004',
      customer: 'Sarah Wilson',
      amount: 1500,
      status: 'pending',
      date: '2025-01-12'
    }
  ];

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800'
    };
    return colors[status as keyof typeof colors];
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
        <div className="space-y-4">
          {orders.map((order, index) => (
            <div
              key={order.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-all duration-300 transform hover:scale-[1.02] animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center space-x-4">
                <div>
                  <p className="font-semibold">{order.id}</p>
                  <p className="text-sm text-gray-600">{order.customer}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="font-semibold">₹{order.amount}</p>
                  <p className="text-sm text-gray-600">{order.date}</p>
                </div>
                
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
      </CardContent>
    </Card>
  );
};

export default RecentOrdersTable;
