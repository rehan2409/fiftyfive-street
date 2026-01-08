import React, { useState, useEffect } from 'react';
import { useCoupons } from '@/hooks/useSupabaseCoupons';
import { X, Tag, Sparkles, Gift, Percent, Clock, Copy, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

const PromoBanner = () => {
  const { data: coupons = [] } = useCoupons();
  const [dismissed, setDismissed] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Get active coupons that haven't expired and have usages left
  const activeCoupons = coupons.filter(coupon => {
    const now = new Date();
    const expiryDate = new Date(coupon.expiryDate);
    return coupon.active && 
           expiryDate > now && 
           coupon.currentUsages < coupon.maxUsages;
  });

  // Auto-rotate coupons
  useEffect(() => {
    if (!isAutoPlaying || activeCoupons.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeCoupons.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, activeCoupons.length]);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Code "${code}" copied!`);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handlePrev = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + activeCoupons.length) % activeCoupons.length);
  };

  const handleNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % activeCoupons.length);
  };

  const getDaysRemaining = (expiryDate: string) => {
    const now = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (dismissed || activeCoupons.length === 0) {
    return null;
  }

  return (
    <div className="relative overflow-hidden">
      {/* Gradient background with animated particles */}
      <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-fuchsia-500 to-pink-500">
        {/* Animated sparkles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
        
        {/* Floating shapes */}
        <div className="absolute top-0 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-pulse" />
        <div className="absolute bottom-0 right-20 w-40 h-40 bg-yellow-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-pink-300/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }} />
      </div>

      <div className="relative container mx-auto px-4 py-4">
        {/* Main content */}
        <div className="flex items-center justify-between gap-4">
          {/* Navigation - Left */}
          {activeCoupons.length > 1 && (
            <button
              onClick={handlePrev}
              className="hidden sm:flex p-2 rounded-full bg-white/20 hover:bg-white/30 transition-all hover:scale-110"
              aria-label="Previous coupon"
            >
              <ChevronLeft className="h-5 w-5 text-white" />
            </button>
          )}

          {/* Coupon Cards Carousel */}
          <div className="flex-1 overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {activeCoupons.map((coupon, index) => {
                const discountText = coupon.type === 'percentage' 
                  ? `${coupon.value}%` 
                  : `₹${coupon.value}`;
                const daysRemaining = getDaysRemaining(coupon.expiryDate);
                const isUrgent = daysRemaining <= 3;
                
                return (
                  <div
                    key={coupon.id}
                    className="w-full flex-shrink-0 flex items-center justify-center gap-3 sm:gap-6 px-2"
                  >
                    {/* Sparkle icon */}
                    <div className="hidden sm:flex items-center justify-center w-12 h-12 rounded-full bg-yellow-400 shadow-lg shadow-yellow-400/50 animate-bounce">
                      <Gift className="h-6 w-6 text-yellow-900" />
                    </div>

                    {/* Main offer display */}
                    <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
                      {/* Discount badge */}
                      <div className="relative">
                        <div className="flex items-center gap-1 bg-white text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-pink-600 px-4 py-2 rounded-2xl shadow-xl">
                          <span className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-violet-600 to-pink-600 bg-clip-text text-transparent">
                            {discountText}
                          </span>
                          <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-violet-600 to-pink-600 bg-clip-text text-transparent">
                            OFF
                          </span>
                        </div>
                        <Sparkles className="absolute -top-2 -right-2 h-5 w-5 text-yellow-300 animate-spin" style={{ animationDuration: '3s' }} />
                      </div>

                      {/* Code section */}
                      <div className="flex flex-col items-center sm:items-start gap-1">
                        <span className="text-white/90 text-xs sm:text-sm font-medium">Use code:</span>
                        <button
                          onClick={() => handleCopyCode(coupon.code)}
                          className="group flex items-center gap-2 bg-white/20 backdrop-blur-md border-2 border-dashed border-white/50 rounded-lg px-4 py-2 hover:bg-white/30 transition-all hover:scale-105 hover:border-white"
                        >
                          <Tag className="h-4 w-4 text-yellow-300" />
                          <span className="font-mono font-bold text-lg sm:text-xl tracking-widest text-white">
                            {coupon.code}
                          </span>
                          {copiedCode === coupon.code ? (
                            <Check className="h-4 w-4 text-green-300" />
                          ) : (
                            <Copy className="h-4 w-4 text-white/70 group-hover:text-white transition-colors" />
                          )}
                        </button>
                      </div>

                      {/* Timer/Urgency badge */}
                      <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold ${
                        isUrgent 
                          ? 'bg-red-500 text-white animate-pulse' 
                          : 'bg-white/20 text-white'
                      }`}>
                        <Clock className="h-3.5 w-3.5" />
                        <span>
                          {isUrgent ? `${daysRemaining}d left!` : `${daysRemaining} days`}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Navigation - Right */}
          {activeCoupons.length > 1 && (
            <button
              onClick={handleNext}
              className="hidden sm:flex p-2 rounded-full bg-white/20 hover:bg-white/30 transition-all hover:scale-110"
              aria-label="Next coupon"
            >
              <ChevronRight className="h-5 w-5 text-white" />
            </button>
          )}

          {/* Dismiss button */}
          <button 
            onClick={() => setDismissed(true)}
            className="p-1.5 hover:bg-white/20 rounded-full transition-colors"
            aria-label="Dismiss banner"
          >
            <X className="h-4 w-4 text-white/80 hover:text-white" />
          </button>
        </div>

        {/* Dots indicator for multiple coupons */}
        {activeCoupons.length > 1 && (
          <div className="flex justify-center gap-2 mt-3">
            {activeCoupons.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setIsAutoPlaying(false);
                  setCurrentIndex(index);
                }}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'bg-white w-6' 
                    : 'bg-white/40 hover:bg-white/60'
                }`}
                aria-label={`Go to coupon ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* "More offers" indicator */}
        {activeCoupons.length > 1 && (
          <div className="text-center mt-2">
            <span className="text-white/70 text-xs">
              🎁 {activeCoupons.length} offers available • Swipe or click to explore
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PromoBanner;
