
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useStore } from '@/store/useStore';
import { ArrowLeft, Upload } from 'lucide-react';

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, user, appliedCoupon, addOrder, clearCart, checkoutQR } = useStore();
  const [customerInfo, setCustomerInfo] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    pincode: ''
  });
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [couponCode, setCouponCode] = useState('');
  const [loading, setLoading] = useState(false);

  const subtotal = cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  const discount = appliedCoupon 
    ? appliedCoupon.type === 'percentage' 
      ? (subtotal * appliedCoupon.value) / 100
      : appliedCoupon.value
    : 0;
  const total = subtotal - discount;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomerInfo({
      ...customerInfo,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPaymentProof(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!paymentProof) {
      alert('Please upload payment proof');
      return;
    }

    setLoading(true);

    // Create order
    const order = {
      id: Date.now().toString(),
      items: cart,
      total,
      discount,
      couponCode: appliedCoupon?.code,
      customerInfo,
      paymentProof: paymentProof.name,
      status: 'Processing' as const,
      createdAt: new Date().toISOString()
    };

    addOrder(order);
    clearCart();
    
    setTimeout(() => {
      navigate(`/order-confirmation/${order.id}`);
      setLoading(false);
    }, 2000);
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
          <Button onClick={() => navigate('/products/all')}>
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </Button>

        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Checkout</h1>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Checkout Form */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Shipping Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Name</label>
                        <Input
                          name="name"
                          value={customerInfo.name}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Phone</label>
                        <Input
                          name="phone"
                          value={customerInfo.phone}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Email</label>
                      <Input
                        name="email"
                        type="email"
                        value={customerInfo.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Address</label>
                      <Input
                        name="address"
                        value={customerInfo.address}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Pincode</label>
                      <Input
                        name="pincode"
                        value={customerInfo.pincode}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    {/* Payment Section */}
                    <div className="pt-6 border-t">
                      <h3 className="font-semibold mb-4">Payment</h3>
                      
                      {checkoutQR && (
                        <div className="mb-4">
                          <p className="text-sm text-gray-600 mb-2">Scan QR code to pay:</p>
                          <img src={checkoutQR} alt="Payment QR Code" className="w-48 h-48 mx-auto" />
                        </div>
                      )}

                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Upload Payment Screenshot
                        </label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                            id="payment-proof"
                          />
                          <label htmlFor="payment-proof" className="cursor-pointer">
                            <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                            <p className="text-sm text-gray-600">
                              {paymentProof ? paymentProof.name : 'Click to upload payment proof'}
                            </p>
                          </label>
                        </div>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-black text-white hover:bg-gray-800 py-3 text-lg"
                      disabled={loading}
                    >
                      {loading ? 'Processing Order...' : 'Place Order'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div key={`${item.productId}-${item.size}`} className="flex justify-between">
                        <div>
                          <p className="font-medium">{item.product.name}</p>
                          <p className="text-sm text-gray-600">Size: {item.size} | Qty: {item.quantity}</p>
                        </div>
                        <p className="font-semibold">₹{item.product.price * item.quantity}</p>
                      </div>
                    ))}

                    <div className="border-t pt-4 space-y-2">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>₹{subtotal}</span>
                      </div>
                      {appliedCoupon && (
                        <div className="flex justify-between text-green-600">
                          <span>Discount ({appliedCoupon.code}):</span>
                          <span>-₹{discount}</span>
                        </div>
                      )}
                      <div className="flex justify-between font-bold text-lg pt-2 border-t">
                        <span>Total:</span>
                        <span>₹{total}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
