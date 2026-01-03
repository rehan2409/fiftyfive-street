
import React from 'react';
import { useStore } from '@/store/useStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Package, Download } from 'lucide-react';
import { generateInvoicePDF } from '@/utils/invoiceGenerator';
import { useOrders } from '@/hooks/useSupabaseOrders';

const Account = () => {
  const { user } = useStore();
  const { data: allOrders = [], isLoading } = useOrders();
  
  // Filter orders by user email (customer_info contains email)
  const userOrders = allOrders.filter(order => 
    order.customerInfo?.email === user?.email
  );

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 animate-fade-in">
      <div className="absolute inset-0 opacity-30">
        <div className="h-full w-full bg-[radial-gradient(circle_at_1px_1px,rgba(59,130,246,0.15)_1px,transparent_0)] bg-[length:20px_20px]"></div>
      </div>
      
      <div className="relative container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-scale-in">
              My Dashboard
            </h1>
            <p className="text-gray-600 mt-2">Manage your profile and track your orders</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Profile Info */}
            <div className="md:col-span-1">
              <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-lg">
                  <CardTitle className="flex items-center space-x-2 text-gray-800">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <span>Profile Information</span>
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
              <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300">
                <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 rounded-t-lg">
                  <CardTitle className="flex items-center space-x-2 text-gray-800">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                      <Package className="h-4 w-4 text-white" />
                    </div>
                    <span>Order History & Tracking</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex justify-center items-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  ) : userOrders.length === 0 ? (
                    <div className="text-center py-8 animate-fade-in">
                      <p className="text-gray-500">No orders yet</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {userOrders.map((order, index) => (
                        <div 
                          key={order.id} 
                          className="bg-white/60 backdrop-blur-sm border border-white/30 rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:bg-white/80 transform hover:scale-105 animate-fade-in"
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
                              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 hover:from-blue-600 hover:to-purple-700 flex items-center space-x-2 transition-all duration-300 transform hover:scale-105 shadow-md"
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
