import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useProductReviews, useSubmitReview } from '@/hooks/useProductReviews';
import { useStore } from '@/store/useStore';
import { Star, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProductReviewsProps {
  productId: string;
  productName: string;
}

const StarRating = ({ rating, onRate, interactive = false }: { rating: number; onRate?: (r: number) => void; interactive?: boolean }) => {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-5 w-5 transition-colors ${
            star <= (interactive ? (hover || rating) : rating)
              ? 'fill-yellow-400 text-yellow-400'
              : 'text-muted-foreground/30'
          } ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''}`}
          onClick={() => interactive && onRate?.(star)}
          onMouseEnter={() => interactive && setHover(star)}
          onMouseLeave={() => interactive && setHover(0)}
        />
      ))}
    </div>
  );
};

const ProductReviews: React.FC<ProductReviewsProps> = ({ productId, productName }) => {
  const { data: reviews = [], isLoading } = useProductReviews(productId);
  const submitReview = useSubmitReview();
  const { user } = useStore();
  const { toast } = useToast();

  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '0';

  const handleSubmit = async () => {
    if (!user) {
      toast({ title: 'Sign in required', description: 'Please sign in to leave a review', variant: 'destructive' });
      return;
    }
    if (rating === 0) {
      toast({ title: 'Rating required', description: 'Please select a star rating', variant: 'destructive' });
      return;
    }

    try {
      await submitReview.mutateAsync({
        product_id: productId,
        customer_email: user.email,
        customer_name: user.name,
        rating,
        review_text: reviewText || undefined,
      });
      toast({ title: 'Review submitted!', description: 'Thank you for your feedback.' });
      setRating(0);
      setReviewText('');
      setShowForm(false);
    } catch {
      toast({ title: 'Error', description: 'Failed to submit review', variant: 'destructive' });
    }
  };

  return (
    <Card className="mt-8">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Customer Reviews ({reviews.length})
          </CardTitle>
          <div className="flex items-center gap-2">
            <StarRating rating={Math.round(Number(avgRating))} />
            <span className="text-sm font-medium text-muted-foreground">{avgRating}/5</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Write Review */}
        {!showForm ? (
          <Button variant="outline" onClick={() => setShowForm(true)} className="w-full">
            Write a Review
          </Button>
        ) : (
          <Card className="border-primary/20 bg-muted/30">
            <CardContent className="pt-4 space-y-3">
              <p className="font-medium text-sm">Rate {productName}</p>
              <StarRating rating={rating} onRate={setRating} interactive />
              <Textarea
                placeholder="Share your experience with this product..."
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                rows={3}
              />
              <div className="flex gap-2">
                <Button onClick={handleSubmit} disabled={submitReview.isPending} size="sm">
                  {submitReview.isPending ? 'Submitting...' : 'Submit Review'}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => { setShowForm(false); setRating(0); setReviewText(''); }}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Reviews List */}
        {isLoading ? (
          <p className="text-sm text-muted-foreground text-center py-4">Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">No reviews yet. Be the first to review!</p>
        ) : (
          <div className="space-y-3">
            {reviews.map((review) => (
              <div key={review.id} className="border rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                      {review.customer_name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{review.customer_name}</p>
                      <p className="text-xs text-muted-foreground">{new Date(review.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <StarRating rating={review.rating} />
                </div>
                {review.review_text && (
                  <p className="text-sm text-muted-foreground">{review.review_text}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductReviews;
