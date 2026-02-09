import { useMemo } from 'react';
import { useStore, Product } from '@/store/useStore';
import { useProducts } from '@/hooks/useSupabaseProducts';

interface RecommendationResult {
  personalized: Product[];
  trending: Product[];
  isLoading: boolean;
}

export const useProductRecommendations = (
  currentProductId?: string,
  limit = 4
): RecommendationResult => {
  const { orders, user } = useStore();
  const { data: allProducts = [], isLoading } = useProducts();

  return useMemo(() => {
    // Exclude the current product from recommendations
    const available = currentProductId
      ? allProducts.filter((p) => p.id !== currentProductId)
      : allProducts;

    // --- Personalized: based on past purchase categories ---
    let personalized: Product[] = [];
    if (user && orders.length > 0) {
      // Gather categories the user has bought
      const purchasedCategories = new Set<string>();
      const purchasedProductIds = new Set<string>();

      orders.forEach((order) => {
        order.items.forEach((item) => {
          purchasedProductIds.add(item.productId);
          if (item.product?.category) {
            purchasedCategories.add(item.product.category);
          }
        });
      });

      // Recommend products in same categories that user hasn't bought yet
      const unseen = available.filter(
        (p) => purchasedCategories.has(p.category) && !purchasedProductIds.has(p.id)
      );

      // Sort by newest first
      personalized = unseen
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, limit);

      // If not enough, fill with other unseen products
      if (personalized.length < limit) {
        const remaining = available
          .filter((p) => !purchasedProductIds.has(p.id) && !personalized.some((r) => r.id === p.id))
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, limit - personalized.length);
        personalized = [...personalized, ...remaining];
      }
    }

    // --- Trending: recently added products ---
    const trending = [...available]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);

    return { personalized, trending, isLoading };
  }, [allProducts, orders, user, currentProductId, limit, isLoading]);
};
