
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useStore } from '@/store/useStore';
import { toast } from '@/hooks/use-toast';
import CouponInput from '@/components/CouponInput';
import { supabase } from '@/integrations/supabase/client';
import { CreditCard, Shield, Loader2 } from 'lucide-react';

declare global {
  interface Window {
    Razorpay: any;
  }
}

const Checkout = () => {
  const navigate = useNavigate();
  const { 
    cart, 
    user, 
    appliedCoupon, 
    clearCart, 
    addOrder 
  } = useStore();

  const [isProcessing, setIsProcessing] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => setRazorpayLoaded(true);
    document.body.appendChild(script);
    
    return () => {
      document.body.removeChild(script);
    };
  }, []);

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

  const handlePayment = async (e: React.FormEvent) => {
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

    if (!razorpayLoaded) {
      toast({
        title: "Error",
        description: "Payment gateway is loading, please try again",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Create Razorpay order
      const { data: orderData, error: orderError } = await supabase.functions.invoke('create-razorpay-order', {
        body: {
          amount: total,
          currency: 'INR',
          receipt: `order_${Date.now()}`,
          notes: {
            customer_name: customerInfo.name,
            customer_email: customerInfo.email,
          },
        },
      });

      if (orderError || !orderData) {
        throw new Error(orderError?.message || 'Failed to create payment order');
      }

      console.log('Razorpay order created:', orderData);

      // Open Razorpay checkout
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Fashion Store',
        description: 'Order Payment',
        order_id: orderData.orderId,
        prefill: {
          name: customerInfo.name,
          email: customerInfo.email,
          contact: customerInfo.phone,
        },
        notes: {
          address: customerInfo.address,
        },
        theme: {
          color: '#000000',
        },
        handler: async (response: any) => {
          console.log('Payment successful:', response);
          
          try {
            // Verify payment and create order
            const { data: verifyData, error: verifyError } = await supabase.functions.invoke('verify-razorpay-payment', {
              body: {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                order_data: {
                  items: cart.map(item => ({
                    productId: item.productId,
                    name: item.product.name,
                    size: item.size,
                    quantity: item.quantity,
                    price: item.product.price,
                  })),
                  total,
                  discount,
                  couponCode: appliedCoupon?.code,
                  customerInfo,
                },
              },
            });

            if (verifyError || !verifyData?.success) {
              throw new Error('Payment verification failed');
            }

            // Add to local store as well
            const order = {
              id: verifyData.orderId,
              items: cart,
              total,
              discount,
              couponCode: appliedCoupon?.code,
              customerInfo,
              paymentProof: `Razorpay: ${response.razorpay_payment_id}`,
              status: 'Processing' as const,
              createdAt: new Date().toISOString(),
            };

            addOrder(order);
            clearCart();

            toast({
              title: "Payment successful!",
              description: "Your order has been confirmed.",
            });

            navigate(`/order-confirmation/${verifyData.orderId}`);
          } catch (error) {
            console.error('Verification error:', error);
            toast({
              title: "Payment verification failed",
              description: "Please contact support with your payment ID",
              variant: "destructive",
            });
          }
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
            toast({
              title: "Payment cancelled",
              description: "You can try again when ready",
            });
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error: any) {
      console.error('Payment error:', error);
      toast({
        title: "Payment failed",
        description: error.message || "Please try again",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };

  if (!user) {
    return null;
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center animate-fade-in">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
          <Button 
            onClick={() => navigate('/')}
            className="transition-all duration-300 transform hover:scale-105"
          >
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 animate-fade-in">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 animate-scale-in">Checkout</h1>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Order Summary */}
            <div>
              <Card className="mb-6 transition-all duration-300 hover:shadow-lg">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {cart.map((item, index) => (
                      <div 
                        key={index} 
                        className="flex justify-between transition-all duration-300 hover:bg-gray-50 p-2 rounded animate-fade-in"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
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
                      <div className="flex justify-between mb-2 text-green-600 animate-pulse">
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
              <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <CouponInput />
              </div>

              {/* Security Badge */}
              <Card className="mt-6 bg-green-50 border-green-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Shield className="h-8 w-8 text-green-600" />
                    <div>
                      <p className="font-semibold text-green-800">Secure Payment</p>
                      <p className="text-sm text-green-600">Powered by Razorpay - 256-bit SSL encryption</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Customer Information & Payment */}
            <div>
              <form onSubmit={handlePayment} className="space-y-6">
                <Card className="transition-all duration-300 hover:shadow-lg">
                  <CardHeader>
                    <CardTitle>Shipping Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {['name', 'email', 'phone', 'address', 'pincode'].map((field, index) => (
                      <div key={field} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                        <label className="block text-sm font-medium mb-1 capitalize">
                          {field === 'pincode' ? 'PIN Code' : field} *
                        </label>
                        <Input
                          name={field}
                          type={field === 'email' ? 'email' : 'text'}
                          value={customerInfo[field as keyof typeof customerInfo]}
                          onChange={handleInputChange}
                          required
                          className="transition-all duration-300 focus:scale-105"
                        />
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="transition-all duration-300 hover:shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      Payment
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center p-6 bg-muted rounded-lg">
                      <CreditCard className="h-12 w-12 mx-auto mb-4 text-primary" />
                      <p className="font-medium mb-2">Secure Online Payment</p>
                      <p className="text-sm text-muted-foreground mb-4">
                        Pay securely using UPI, Credit/Debit Cards, Net Banking, or Wallets
                      </p>
                      <div className="flex justify-center gap-2 flex-wrap">
                        <span className="px-3 py-1 bg-background rounded text-xs font-medium">GPay</span>
                        <span className="px-3 py-1 bg-background rounded text-xs font-medium">PhonePe</span>
                        <span className="px-3 py-1 bg-background rounded text-xs font-medium">Paytm</span>
                        <span className="px-3 py-1 bg-background rounded text-xs font-medium">Cards</span>
                        <span className="px-3 py-1 bg-background rounded text-xs font-medium">Net Banking</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Button 
                  type="submit" 
                  className="w-full transition-all duration-300 transform hover:scale-105" 
                  size="lg"
                  disabled={isProcessing || !razorpayLoaded}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-4 w-4" />
                      Pay ₹{total} Securely
                    </>
                  )}
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
