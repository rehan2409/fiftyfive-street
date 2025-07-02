
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useStore } from '@/store/useStore';
import { toast } from '@/hooks/use-toast';
import CouponInput from '@/components/CouponInput';

const Checkout = () => {
  const navigate = useNavigate();
  const { 
    cart, 
    user, 
    appliedCoupon, 
    clearCart, 
    addOrder, 
    checkoutQR 
  } = useStore();

  // Redirect to login if not signed in
  useEffect(() => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to continue with checkout",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }
  }, [user, navigate]);

  const [customerInfo, setCustomerInfo] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    pincode: ''
  });

  const [paymentProof, setPaymentProof] = useState<string | null>(null);

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const discount = appliedCoupon ? 
    (appliedCoupon.type === 'percentage' ? 
      (subtotal * appliedCoupon.value / 100) : 
      appliedCoupon.value) : 0;
  const total = subtotal - discount;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomerInfo({
      ...customerInfo,
      [e.target.name]: e.target.value
    });
  };

  const handlePaymentProofUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result;
        if (typeof result === 'string') {
          setPaymentProof(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Error",
        description: "Please sign in to place an order",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }

    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone || 
        !customerInfo.address || !customerInfo.pincode) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (!paymentProof) {
      toast({
        title: "Error",
        description: "Please upload payment proof",
        variant: "destructive",
      });
      return;
    }

    const order = {
      id: Date.now().toString(),
      items: cart,
      total: total,
      discount: discount,
      couponCode: appliedCoupon?.code,
      customerInfo,
      paymentProof,
      status: 'Processing' as const,
      createdAt: new Date().toISOString()
    };

    addOrder(order);
    clearCart();
    
    toast({
      title: "Order placed successfully!",
      description: "You will receive a confirmation email shortly.",
    });
    
    navigate(`/order-confirmation/${order.id}`);
  };

  if (!user) {
    return null; // Will redirect to login
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
          <Button onClick={() => navigate('/')}>Continue Shopping</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Checkout</h1>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Order Summary */}
            <div>
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {cart.map((item, index) => (
                      <div key={index} className="flex justify-between">
                        <div>
                          <p className="font-medium">{item.product.name}</p>
                          <p className="text-sm text-gray-600">Size: {item.size} | Qty: {item.quantity}</p>
                        </div>
                        <p className="font-semibold">₹{item.product.price * item.quantity}</p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t pt-4 mt-4">
                    <div className="flex justify-between mb-2">
                      <span>Subtotal:</span>
                      <span>₹{subtotal}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between mb-2 text-green-600">
                        <span>Discount {appliedCoupon?.code ? `(${appliedCoupon.code})` : ''}:</span>
                        <span>-₹{discount}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total:</span>
                      <span>₹{total}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Coupon Input */}
              <CouponInput />
            </div>

            {/* Customer Information & Payment */}
            <div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Shipping Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Name *</label>
                      <Input
                        name="name"
                        value={customerInfo.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Email *</label>
                      <Input
                        name="email"
                        type="email"
                        value={customerInfo.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Phone *</label>
                      <Input
                        name="phone"
                        value={customerInfo.phone}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Address *</label>
                      <Input
                        name="address"
                        value={customerInfo.address}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">PIN Code *</label>
                      <Input
                        name="pincode"
                        value={customerInfo.pincode}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Payment</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {checkoutQR ? (
                      <div>
                        <p className="text-sm font-medium mb-2">Scan QR Code to Pay:</p>
                        <img src={checkoutQR} alt="Payment QR Code" className="w-48 h-48 mx-auto border rounded" />
                        <p className="text-center text-sm text-gray-600 mt-2">
                          Amount: ₹{total}
                        </p>
                      </div>
                    ) : (
                      <div className="text-center p-8 border border-dashed rounded">
                        <p className="text-gray-500">QR Code not available</p>
                        <p className="text-sm text-gray-400">Please contact support</p>
                      </div>
                    )}
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Upload Payment Screenshot *</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePaymentProofUpload}
                        required
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-black file:text-white hover:file:bg-gray-800"
                      />
                      {paymentProof && (
                        <div className="mt-2">
                          <img src={paymentProof} alt="Payment proof" className="w-32 h-32 object-cover rounded border" />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Button type="submit" className="w-full" size="lg">
                  Place Order - ₹{total}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
