
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Order } from '@/store/useStore';
import { Download, ZoomIn } from 'lucide-react';
import { generateInvoicePDF } from '@/utils/invoiceGenerator';

interface OrderDetailsModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ order, isOpen, onClose }) => {
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  if (!order) return null;

  const getStatusColor = (status: string) => {
    const colors = {
      'Processing': 'bg-yellow-100 text-yellow-800',
      'Packed': 'bg-blue-100 text-blue-800',
      'Out for Delivery': 'bg-purple-100 text-purple-800',
      'Delivered': 'bg-green-100 text-green-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const handleDownloadInvoice = () => {
    generateInvoicePDF(order);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              Order Details - {order.id}
              <Badge className={getStatusColor(order.status)}>
                {order.status}
              </Badge>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Customer Information */}
            <div>
              <h3 className="font-semibold mb-3">Customer Information</h3>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <p><strong>Name:</strong> {order.customerInfo.name}</p>
                <p><strong>Email:</strong> {order.customerInfo.email}</p>
                <p><strong>Phone:</strong> {order.customerInfo.phone}</p>
                <p><strong>Address:</strong> {order.customerInfo.address}</p>
                <p><strong>Pincode:</strong> {order.customerInfo.pincode}</p>
              </div>
            </div>

            <Separator />

            {/* Order Items */}
            <div>
              <h3 className="font-semibold mb-3">Order Items</h3>
              <div className="space-y-3">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {item.product.images && item.product.images[0] && (
                        <img 
                          src={item.product.images[0]} 
                          alt={item.product.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                      )}
                      <div>
                        <p className="font-medium">{item.product.name}</p>
                        <p className="text-sm text-gray-600">Size: {item.size}</p>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="font-semibold">₹{(item.product.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Order Summary */}
            <div>
              <h3 className="font-semibold mb-3">Order Summary</h3>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>₹{(order.total + order.discount).toFixed(2)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount {order.couponCode ? `(${order.couponCode})` : ''}:</span>
                    <span>-₹{order.discount.toFixed(2)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total:</span>
                  <span>₹{order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Payment Proof */}
            {order.paymentProof && (
              <div>
                <h3 className="font-semibold mb-3">Payment Proof</h3>
                <div className="relative">
                  <img 
                    src={order.paymentProof} 
                    alt="Payment Proof"
                    className="max-w-full h-auto rounded-lg border cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => setIsImageModalOpen(true)}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                    onClick={() => setIsImageModalOpen(true)}
                  >
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            <Separator />

            {/* Order Info */}
            <div className="text-sm text-gray-600">
              <p><strong>Order Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
              <p><strong>Order ID:</strong> {order.id}</p>
            </div>

            {/* Actions */}
            <div className="flex space-x-2 pt-4">
              <Button onClick={handleDownloadInvoice} className="flex-1">
                <Download className="h-4 w-4 mr-2" />
                Download Invoice
              </Button>
              <Button variant="outline" onClick={onClose} className="flex-1">
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Full-size Image Modal */}
      <Dialog open={isImageModalOpen} onOpenChange={setIsImageModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0">
          <div className="relative">
            <img 
              src={order?.paymentProof} 
              alt="Payment Proof - Full Size"
              className="w-full h-full object-contain rounded-lg"
            />
            <Button
              variant="outline"
              size="sm"
              className="absolute top-4 right-4 bg-white/80 hover:bg-white"
              onClick={() => setIsImageModalOpen(false)}
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default OrderDetailsModal;
