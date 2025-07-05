
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Filter, Search, Grid, List } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { useProducts } from '@/hooks/useSupabaseProducts';
import { useToast } from '@/hooks/use-toast';

const Products = () => {
  const { category } = useParams();
  const { data: products = [], isLoading, error } = useProducts();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [priceRange, setPriceRange] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Handle add to cart with toast notification
  const handleAddToCart = (product: any) => {
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  // Filter products based on category, search, and price range
  const filteredProducts = products.filter(product => {
    const matchesCategory = !category || category === 'all' || product.category.toLowerCase() === category.toLowerCase();
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    let matchesPrice = true;
    if (priceRange !== 'all') {
      const price = product.price;
      switch (priceRange) {
        case 'under-1000':
          matchesPrice = price < 1000;
          break;
        case '1000-2000':
          matchesPrice = price >= 1000 && price <= 2000;
          break;
        case 'over-2000':
          matchesPrice = price > 2000;
          break;
      }
    }
    
    return matchesCategory && matchesSearch && matchesPrice;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  const categoryTitle = category ? 
    category.charAt(0).toUpperCase() + category.slice(1) : 
    'All Products';

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading products...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-red-600 mb-4">Failed to load products</p>
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 animate-fade-in">
            {categoryTitle}
          </h1>
          <p className="text-gray-600 animate-fade-in">
            Discover our amazing collection of {categoryTitle.toLowerCase()}
          </p>
        </div>

        {/* Filters and Search */}
        <Card className="mb-8 animate-fade-in-up">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="h-5 w-5" />
              <span>Filters & Search</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4 mb-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>

              {/* Price Range */}
              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Price range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="under-1000">Under ₹1,000</SelectItem>
                  <SelectItem value="1000-2000">₹1,000 - ₹2,000</SelectItem>
                  <SelectItem value="over-2000">Over ₹2,000</SelectItem>
                </SelectContent>
              </Select>

              {/* View Mode */}
              <div className="flex space-x-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="flex-1"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="flex-1"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Results count */}
            <div className="flex items-center justify-between">
              <Badge variant="outline">
                {sortedProducts.length} products found
              </Badge>
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSearchTerm('')}
                >
                  Clear search
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Products Grid */}
        {sortedProducts.length === 0 ? (
          <Card className="animate-fade-in-up">
            <CardContent className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Search className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No products found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm ? 
                  `No products match "${searchTerm}". Try adjusting your search or filters.` :
                  'No products available in this category at the moment.'
                }
              </p>
              {searchTerm && (
                <Button onClick={() => setSearchTerm('')}>
                  Clear search
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className={`grid gap-6 animate-fade-in-up ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1'
          }`}>
            {sortedProducts.map((product, index) => (
              <div
                key={product.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <ProductCard 
                  product={product} 
                  onAddToCart={handleAddToCart}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
