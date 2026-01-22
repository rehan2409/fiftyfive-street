import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Download, Loader2 } from 'lucide-react';
import { generateInvoicePDF } from '@/utils/invoiceGenerator';
import OrderDetailsModal from './OrderDetailsModal';
import { Order } from '@/store/useStore';
import { useOrders, useUpdateOrderStatus } from '@/hooks/useSupabaseOrders';
import { toast } from 'sonner';

const RecentOrdersTable = () => {
  const { data: orders = [], isLoading } = useOrders();
  const updateOrderStatusMutation = useUpdateOrderStatus();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getStatusColor = (status: string) => {
    const colors = {
      'Processing': 'bg-yellow-100 text-yellow-800',
      'Packed': 'bg-blue-100 text-blue-800',
      'Out for Delivery': 'bg-purple-100 text-purple-800',
      'Delivered': 'bg-green-100 text-green-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const handleStatusChange = (orderId: string, newStatus: Order['status']) => {
    updateOrderStatusMutation.mutate(
      { id: orderId, status: newStatus },
      {
        onSuccess: () => {
          toast.success('Order status updated');
        },
        onError: (error) => {
          toast.error('Failed to update status');
          console.error('Status update error:', error);
        }
      }
    );
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleDownloadInvoice = (order: Order) => {
    try {
      generateInvoicePDF(order);
      toast.success('Invoice downloaded successfully');
    } catch (error) {
      toast.error('Failed to download invoice');
      console.error('Invoice generation error:', error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  if (isLoading) {
    return (
      <Card className="animate-fade-in-up">
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
            <span className="ml-2 text-muted-foreground">Loading orders...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="animate-fade-in-up">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Recent Orders
            <Badge variant="outline" className="ml-2">
              {orders.length} total
            </Badge>
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
                      <p className="font-semibold font-mono text-sm">{order.id.slice(0, 8)}...</p>
                      <p className="text-sm text-gray-600">{order.customerInfo?.name || 'Unknown'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="font-semibold">₹{order.total?.toLocaleString() || 0}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value as Order['status'])}
                      className="px-2 py-1 border rounded text-sm"
                      disabled={updateOrderStatusMutation.isPending}
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
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="hover:scale-110 transition-transform"
                        onClick={() => handleViewOrder(order)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="hover:scale-110 transition-transform"
                        onClick={() => handleDownloadInvoice(order)}
                      >
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

      <OrderDetailsModal 
        order={selectedOrder}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
};

export default RecentOrdersTable;
