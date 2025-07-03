
import React from 'react';
import { useStore } from '@/store/useStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Package, Download } from 'lucide-react';
import { generateInvoicePDF } from '@/utils/invoiceGenerator';

const Account = () => {
  const { user, orders } = useStore();

  const handleDownloadInvoice = (order: any) => {
    generateInvoicePDF(order);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center animate-fade-in">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please sign in to view your account</h2>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Processing': return 'bg-yellow-100 text-yellow-800';
      case 'Packed': return 'bg-blue-100 text-blue-800';
      case 'Out for Delivery': return 'bg-purple-100 text-purple-800';
      case 'Delivered': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 animate-fade-in">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 animate-scale-in">My Account</h1>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Profile Info */}
            <div className="md:col-span-1">
              <Card className="transition-all duration-300 hover:shadow-lg transform hover:scale-105">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="h-5 w-5" />
                    <span>Profile</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Name</label>
                      <p className="text-lg">{user.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Email</label>
                      <p className="text-lg">{user.email}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order History */}
            <div className="md:col-span-2">
              <Card className="transition-all duration-300 hover:shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Package className="h-5 w-5" />
                    <span>Order History</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {orders.length === 0 ? (
                    <div className="text-center py-8 animate-fade-in">
                      <p className="text-gray-500">No orders yet</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order, index) => (
                        <div 
                          key={order.id} 
                          className="border border-gray-200 rounded-lg p-4 transition-all duration-300 hover:shadow-md transform hover:scale-105 animate-fade-in"
                          style={{ animationDelay: `${index * 0.1}s` }}
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <p className="font-semibold">Order #{order.id}</p>
                              <p className="text-sm text-gray-600">
                                {new Date(order.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold">₹{order.total}</p>
                              <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getStatusColor(order.status)} animate-pulse`}>
                                {order.status}
                              </span>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            {order.items.map((item, index) => (
                              <div key={index} className="flex justify-between text-sm">
                                <span>{item.product.name} (Size: {item.size})</span>
                                <span>Qty: {item.quantity}</span>
                              </div>
                            ))}
                          </div>

                          <div className="mt-3 pt-3 border-t">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleDownloadInvoice(order)}
                              className="flex items-center space-x-2 transition-all duration-300 transform hover:scale-105"
                            >
                              <Download className="h-4 w-4" />
                              <span>Download Invoice</span>
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
