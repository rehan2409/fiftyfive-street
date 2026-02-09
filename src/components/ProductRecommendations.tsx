import React from 'react';
import ProductCard from '@/components/ProductCard';
import { useProductRecommendations } from '@/hooks/useProductRecommendations';
import { useStore } from '@/store/useStore';
import { TrendingUp, Sparkles } from 'lucide-react';

interface ProductRecommendationsProps {
  currentProductId?: string;
  limit?: number;
  showPersonalized?: boolean;
  showTrending?: boolean;
}

const ProductRecommendations: React.FC<ProductRecommendationsProps> = ({
  currentProductId,
  limit = 4,
  showPersonalized = true,
  showTrending = true,
}) => {
  const { personalized, trending, isLoading } = useProductRecommendations(currentProductId, limit);
  const { user } = useStore();

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  const hasPersonalized = showPersonalized && user && personalized.length > 0;
  const hasTrending = showTrending && trending.length > 0;

  if (!hasPersonalized && !hasTrending) return null;

  return (
    <div className="space-y-12">
      {/* Personalized Recommendations */}
      {hasPersonalized && (
        <section>
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="h-6 w-6 text-yellow-500" />
            <h2 className="text-2xl font-bold">Recommended for You</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {personalized.map((product, index) => (
              <div
                key={product.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Trending Products */}
      {hasTrending && (
        <section>
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="h-6 w-6 text-red-500" />
            <h2 className="text-2xl font-bold">Trending Now</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trending.map((product, index) => (
              <div
                key={product.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductRecommendations;
