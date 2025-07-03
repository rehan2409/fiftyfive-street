
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useStore } from '@/store/useStore';
import { CheckCircle, Download, Home } from 'lucide-react';
import { generateInvoicePDF } from '@/utils/invoiceGenerator';

const OrderConfirmation = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { orders } = useStore();

  const order = orders.find(o => o.id === orderId);

  const handleDownloadInvoice = () => {
    if (order) {
      generateInvoicePDF(order);
    }
  };

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center animate-fade-in">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Order not found</h2>
          <Link to="/">
            <Button className="transition-all duration-300 transform hover:scale-105">Go Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 animate-fade-in">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8 animate-scale-in">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4 animate-pulse" />
            <h1 className="text-3xl font-bold text-green-800 mb-2">Order Confirmed!</h1>
            <p className="text-gray-600">Thank you for your purchase. Your order has been received.</p>
          </div>

          {/* Order Details */}
          <Card className="mb-6 transition-all duration-300 hover:shadow-lg transform hover:scale-105">
            <CardHeader>
              <CardTitle>Order Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="font-medium">Order Number:</span>
                  <span>#{order.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Order Date:</span>
                  <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Status:</span>
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm animate-pulse">
                    {order.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Total Amount:</span>
                  <span className="font-bold text-lg">₹{order.total}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Items Ordered */}
          <Card className="mb-6 transition-all duration-300 hover:shadow-lg transform hover:scale-105">
            <CardHeader>
              <CardTitle>Items Ordered</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center transition-all duration-300 hover:bg-gray-50 p-2 rounded">
                    <div>
                      <p className="font-medium">{item.product.name}</p>
                      <p className="text-sm text-gray-600">Size: {item.size} | Quantity: {item.quantity}</p>
                    </div>
                    <p className="font-semibold">₹{item.product.price * item.quantity}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Shipping Address */}
          <Card className="mb-8 transition-all duration-300 hover:shadow-lg transform hover:scale-105">
            <CardHeader>
              <CardTitle>Shipping Address</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="font-medium">{order.customerInfo.name}</p>
                <p>{order.customerInfo.address}</p>
                <p>{order.customerInfo.pincode}</p>
                <p>{order.customerInfo.phone}</p>
                <p>{order.customerInfo.email}</p>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              onClick={handleDownloadInvoice}
              className="flex-1 flex items-center justify-center space-x-2 transition-all duration-300 transform hover:scale-105"
            >
              <Download className="h-4 w-4" />
              <span>Download Invoice</span>
            </Button>
            <Link to="/" className="flex-1">
              <Button variant="outline" className="w-full flex items-center justify-center space-x-2 transition-all duration-300 transform hover:scale-105">
                <Home className="h-4 w-4" />
                <span>Continue Shopping</span>
              </Button>
            </Link>
          </div>

          {/* Order Status Notice */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg animate-fade-in transition-all duration-300 hover:shadow-md">
            <p className="text-sm text-blue-800">
              <strong>What's next?</strong> We'll send you a confirmation email with tracking information once your order is shipped. 
              You can also track your order status in your account.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
