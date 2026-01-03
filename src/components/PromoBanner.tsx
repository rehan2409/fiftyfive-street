import React from 'react';
import { useCoupons } from '@/hooks/useSupabaseCoupons';
import { X, Tag, Sparkles } from 'lucide-react';
import { useState } from 'react';

const PromoBanner = () => {
  const { data: coupons = [] } = useCoupons();
  const [dismissed, setDismissed] = useState(false);

  // Get active coupons that haven't expired and have usages left
  const activeCoupons = coupons.filter(coupon => {
    const now = new Date();
    const expiryDate = new Date(coupon.expiryDate);
    return coupon.active && 
           expiryDate > now && 
           coupon.currentUsages < coupon.maxUsages;
  });

  if (dismissed || activeCoupons.length === 0) {
    return null;
  }

  const featuredCoupon = activeCoupons[0];
  const discountText = featuredCoupon.type === 'percentage' 
    ? `${featuredCoupon.value}% OFF` 
    : `₹${featuredCoupon.value} OFF`;

  return (
    <div className="relative bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 text-white overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-1/4 w-20 h-20 bg-white rounded-full animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-16 h-16 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
        <div className="absolute top-1/2 left-1/2 w-12 h-12 bg-white rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative container mx-auto px-4 py-3">
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <div className="flex items-center gap-2 animate-bounce">
            <Sparkles className="h-5 w-5" />
            <span className="font-bold text-lg">🎉 SPECIAL OFFER!</span>
          </div>
          
          <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5">
            <Tag className="h-4 w-4" />
            <span className="font-mono font-bold text-lg tracking-wider">{featuredCoupon.code}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black animate-pulse">{discountText}</span>
            <span className="text-sm opacity-90">on your order!</span>
          </div>

          {activeCoupons.length > 1 && (
            <span className="text-xs bg-white/20 rounded-full px-2 py-0.5">
              +{activeCoupons.length - 1} more offers
            </span>
          )}
        </div>
      </div>

      <button 
        onClick={() => setDismissed(true)}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-white/20 rounded-full transition-colors"
        aria-label="Dismiss banner"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

export default PromoBanner;
