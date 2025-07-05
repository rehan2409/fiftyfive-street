
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useStore } from '@/store/useStore';
import { useCoupons } from '@/hooks/useSupabaseCoupons';

const CouponInput = () => {
  const [couponCode, setCouponCode] = useState('');
  const [error, setError] = useState('');
  const { appliedCoupon, applyCoupon, removeCoupon } = useStore();
  const { data: coupons = [] } = useCoupons();

  const validateCoupon = (code: string) => {
    const coupon = coupons.find(c => 
      c.code === code && 
      c.active && 
      c.currentUsages < c.maxUsages &&
      new Date(c.expiryDate) > new Date()
    );
    return coupon || null;
  };

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) return;
    
    const coupon = validateCoupon(couponCode.toUpperCase());
    if (coupon) {
      applyCoupon(coupon);
      setCouponCode('');
      setError('');
    } else {
      setError('Invalid or expired coupon code');
    }
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    setError('');
  };

  // Don't show coupon input if no coupons exist
  if (coupons.length === 0) {
    return null;
  }

  if (appliedCoupon) {
    return (
      <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded">
        <div>
          <span className="text-green-800 font-medium">
            Coupon Applied: {appliedCoupon.code}
          </span>
          <p className="text-green-600 text-sm">
            {appliedCoupon.type === 'percentage' 
              ? `${appliedCoupon.value}% OFF` 
              : `₹${appliedCoupon.value} OFF`
            }
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={handleRemoveCoupon}>
          Remove
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex space-x-2">
        <Input
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
          placeholder="Enter coupon code"
          className="flex-1"
        />
        <Button onClick={handleApplyCoupon} variant="outline">
          Apply
        </Button>
      </div>
      {error && <p className="text-red-600 text-sm">{error}</p>}
    </div>
  );
};

export default CouponInput;
