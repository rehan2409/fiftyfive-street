
import React from 'react';
import { useStore } from '@/store/useStore';
import { useCustomerTargetedCoupons, TargetedCoupon } from '@/hooks/useTargetedCoupons';
import { Gift, Sparkles, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

interface Props {
  context?: 'checkout' | 'cart' | 'account';
  subtotal?: number;
  onApply?: (coupon: TargetedCoupon) => void;
}

const PersonalizedCouponBanner = ({ context = 'account', subtotal = 0, onApply }: Props) => {
  const { user, appliedCoupon } = useStore();
  const { data: coupons = [] } = useCustomerTargetedCoupons(user?.email);

  // Filter eligible coupons based on subtotal
  const eligible = coupons.filter(c => subtotal >= c.minPurchase || context === 'account');

  if (eligible.length === 0) return null;

  const handleApply = (coupon: TargetedCoupon) => {
    if (onApply) {
      onApply(coupon);
    } else {
      toast({
        title: '🎁 Coupon Code',
        description: `Use code "${coupon.code}" at checkout to get ${coupon.type === 'percentage' ? `${coupon.value}%` : `₹${coupon.value}`} off!`,
      });
    }
  };

  return (
    <div className="space-y-3">
      {eligible.map((coupon) => (
        <div
          key={coupon.id}
          className="relative overflow-hidden rounded-xl border-2 border-dashed border-violet-300 bg-gradient-to-r from-violet-50 via-purple-50 to-rose-50 p-4"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-violet-200/40 to-rose-200/40 rounded-full -translate-y-8 translate-x-8" />
          
          <div className="relative flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-rose-500 flex items-center justify-center flex-shrink-0">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-violet-800 flex items-center gap-1">
                <Gift className="h-3.5 w-3.5" />
                {coupon.message || 'Special offer just for you!'}
              </p>
              <div className="mt-1 flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-white rounded-full border border-violet-200 font-mono font-bold text-violet-700 text-sm">
                  <Tag className="h-3 w-3" />
                  {coupon.code}
                </span>
                <span className="text-sm font-semibold text-rose-600">
                  {coupon.type === 'percentage' ? `${coupon.value}% OFF` : `₹${coupon.value} OFF`}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {coupon.minPurchase > 0 && `Min. purchase ₹${coupon.minPurchase} · `}
                {coupon.maxDiscount && `Max discount ₹${coupon.maxDiscount} · `}
                Expires {new Date(coupon.expiryDate).toLocaleDateString('en-IN')}
              </p>
            </div>
            {(context === 'checkout' || context === 'cart') && !appliedCoupon && (
              <Button
                size="sm"
                className="bg-gradient-to-r from-violet-500 to-rose-500 text-white flex-shrink-0"
                onClick={() => handleApply(coupon)}
              >
                Apply
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PersonalizedCouponBanner;
