
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useStore } from '@/store/useStore';
import { useCoupons } from '@/hooks/useSupabaseCoupons';
import { Tag, Check, X, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const CouponInput = () => {
  const [couponCode, setCouponCode] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  const { appliedCoupon, applyCoupon, removeCoupon } = useStore();
  const { data: coupons = [], isLoading } = useCoupons();

  const validateCoupon = (code: string) => {
    const coupon = coupons.find(c => 
      c.code === code && 
      c.active && 
      c.currentUsages < c.maxUsages &&
      new Date(c.expiryDate) > new Date()
    );
    return coupon || null;
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    
    setIsApplying(true);
    const coupon = validateCoupon(couponCode.toUpperCase());
    
    if (coupon) {
      applyCoupon(coupon);
      setCouponCode('');
      toast({
        title: "Coupon Applied!",
        description: `${coupon.type === 'percentage' ? `${coupon.value}% OFF` : `₹${coupon.value} OFF`} applied to your order`,
      });
    } else {
      toast({
        title: "Invalid Coupon",
        description: "This coupon is invalid, expired, or has reached its usage limit",
        variant: "destructive",
      });
    }
    setIsApplying(false);
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    toast({
      title: "Coupon Removed",
      description: "The coupon has been removed from your order",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (appliedCoupon) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 animate-fade-in">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-2 rounded-full">
              <Check className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-green-800">{appliedCoupon.code}</span>
                <span className="text-green-600 font-semibold">
                  {appliedCoupon.type === 'percentage' 
                    ? `${appliedCoupon.value}% OFF` 
                    : `₹${appliedCoupon.value} OFF`
                  }
                </span>
              </div>
              <p className="text-green-600 text-sm">Coupon applied successfully!</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleRemoveCoupon}
            className="text-green-700 hover:text-green-900 hover:bg-green-100"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-muted/50 border rounded-lg p-4 space-y-3">
      <div className="flex items-center gap-2 text-sm font-medium">
        <Tag className="h-4 w-4" />
        <span>Have a coupon code?</span>
      </div>
      <div className="flex gap-2">
        <Input
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
          placeholder="Enter coupon code"
          className="flex-1 uppercase"
          onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
        />
        <Button 
          onClick={handleApplyCoupon} 
          disabled={isApplying || !couponCode.trim()}
          className="min-w-[80px]"
        >
          {isApplying ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            'Apply'
          )}
        </Button>
      </div>
      {coupons.length > 0 && (
        <p className="text-xs text-muted-foreground">
          💡 Check the banner on homepage for active offers!
        </p>
      )}
    </div>
  );
};

export default CouponInput;
