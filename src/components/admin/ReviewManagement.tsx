import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAllReviews, useDeleteReview } from '@/hooks/useProductReviews';
import { useProducts } from '@/hooks/useSupabaseProducts';
import { Star, Trash2, Search, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ReviewManagement = () => {
  const { data: reviews = [], isLoading } = useAllReviews();
  const { data: products = [] } = useProducts();
  const deleteReview = useDeleteReview();
  const { toast } = useToast();
  const [search, setSearch] = useState('');

  const getProductName = (productId: string) => {
    return products.find(p => p.id === productId)?.name || 'Unknown Product';
  };

  const filtered = reviews.filter(r =>
    r.customer_name.toLowerCase().includes(search.toLowerCase()) ||
    r.customer_email.toLowerCase().includes(search.toLowerCase()) ||
    getProductName(r.product_id).toLowerCase().includes(search.toLowerCase()) ||
    (r.review_text || '').toLowerCase().includes(search.toLowerCase())
  );

  const avgRating = reviews.length > 0
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : '0';

  const handleDelete = async (id: string) => {
    try {
      await deleteReview.mutateAsync(id);
      toast({ title: 'Review deleted' });
    } catch {
      toast({ title: 'Error', description: 'Failed to delete review', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardContent className="pt-4 text-center">
            <MessageSquare className="h-8 w-8 mx-auto mb-2 text-blue-500" />
            <p className="text-2xl font-bold">{reviews.length}</p>
            <p className="text-sm text-muted-foreground">Total Reviews</p>
          </CardContent>
        </Card>
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardContent className="pt-4 text-center">
            <Star className="h-8 w-8 mx-auto mb-2 text-yellow-500 fill-yellow-400" />
            <p className="text-2xl font-bold">{avgRating}</p>
            <p className="text-sm text-muted-foreground">Average Rating</p>
          </CardContent>
        </Card>
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardContent className="pt-4 text-center">
            <Star className="h-8 w-8 mx-auto mb-2 text-green-500" />
            <p className="text-2xl font-bold">{reviews.filter(r => r.rating >= 4).length}</p>
            <p className="text-sm text-muted-foreground">Positive Reviews (4-5★)</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search reviews by customer, product, or content..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Reviews List */}
      {isLoading ? (
        <p className="text-center text-muted-foreground py-8">Loading reviews...</p>
      ) : filtered.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">No reviews found</p>
      ) : (
        <div className="space-y-3">
          {filtered.map((review) => (
            <Card key={review.id} className="bg-white/80 backdrop-blur-sm">
              <CardContent className="pt-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="font-medium">{review.customer_name}</span>
                      <span className="text-xs text-muted-foreground">{review.customer_email}</span>
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} className={`h-3.5 w-3.5 ${s <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30'}`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Product: <span className="font-medium text-foreground">{getProductName(review.product_id)}</span>
                    </p>
                    {review.review_text && (
                      <p className="text-sm text-muted-foreground mt-1">"{review.review_text}"</p>
                    )}
                    <p className="text-xs text-muted-foreground">{new Date(review.created_at).toLocaleString()}</p>
                  </div>
                  <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700" onClick={() => handleDelete(review.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewManagement;
