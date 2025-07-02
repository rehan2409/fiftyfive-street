
import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useStore } from '@/store/useStore';

type Category = 'all' | 'Cargos' | 'Jackets' | 'T-Shirts';

const Products = () => {
  const { category } = useParams<{ category: string }>();
  const { products } = useStore();
  
  const [selectedCategory, setSelectedCategory] = useState<Category>(
    (category as Category) || 'all'
  );
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);

  const categories: { value: Category; label: string }[] = [
    { value: 'all', label: 'ALL' },
    { value: 'Cargos', label: 'CARGOS' },
    { value: 'Jackets', label: 'JACKETS' },
    { value: 'T-Shirts', label: 'T-SHIRTS' },
  ];

  const sizes = ['S', 'M', 'L', 'XL', 'XXL'];

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Category filter
      if (selectedCategory !== 'all' && product.category !== selectedCategory) {
        return false;
      }
      
      // Price filter
      if (product.price < priceRange[0] || product.price > priceRange[1]) {
        return false;
      }
      
      // Size filter
      if (selectedSizes.length > 0) {
        const hasSelectedSize = selectedSizes.some(size => 
          product.sizes.includes(size as any)
        );
        if (!hasSelectedSize) return false;
      }
      
      return true;
    });
  }, [products, selectedCategory, priceRange, selectedSizes]);

  const toggleSize = (size: string) => {
    setSelectedSizes(prev => 
      prev.includes(size) 
        ? prev.filter(s => s !== size)
        : [...prev, size]
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-wide mb-4">
            {selectedCategory === 'all' ? 'ALL PRODUCTS' : selectedCategory.toUpperCase()}
          </h1>
          <p className="text-gray-600">
            Discover our premium streetwear collection
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-64 space-y-6">
            {/* Category Filter */}
            <div>
              <h3 className="font-bold text-lg mb-4">CATEGORIES</h3>
              <div className="space-y-2">
                {categories.map((cat) => (
                  <Button
                    key={cat.value}
                    variant={selectedCategory === cat.value ? "default" : "outline"}
                    className="w-full justify-start"
                    onClick={() => setSelectedCategory(cat.value)}
                  >
                    {cat.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Size Filter */}
            <div>
              <h3 className="font-bold text-lg mb-4">SIZES</h3>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => (
                  <Button
                    key={size}
                    variant={selectedSizes.includes(size) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleSize(size)}
                    className="min-w-[3rem]"
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <h3 className="font-bold text-lg mb-4">PRICE RANGE</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span>₹</span>
                  <input
                    type="number"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                    className="w-20 px-2 py-1 border border-gray-300 rounded"
                  />
                  <span>-</span>
                  <input
                    type="number"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className="w-20 px-2 py-1 border border-gray-300 rounded"
                  />
                </div>
              </div>
            </div>

            {/* Clear Filters */}
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                setSelectedCategory('all');
                setPriceRange([0, 10000]);
                setSelectedSizes([]);
              }}
            >
              Clear Filters
            </Button>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No products found</p>
                <p className="text-gray-400">Try adjusting your filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <Link key={product.id} to={`/product/${product.id}`}>
                    <Card className="group cursor-pointer border border-gray-300 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                      <CardContent className="p-0">
                        <div className="h-80 bg-gray-100 relative overflow-hidden">
                          {product.images[0] ? (
                            <img 
                              src={product.images[0]} 
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              onMouseEnter={(e) => {
                                if (product.images[1]) {
                                  (e.target as HTMLImageElement).src = product.images[1];
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (product.images[0]) {
                                  (e.target as HTMLImageElement).src = product.images[0];
                                }
                              }}
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full text-gray-400">
                              No Image Available
                            </div>
                          )}
                          
                          {/* Category Badge */}
                          <div className="absolute top-4 left-4">
                            <span className="bg-black text-white px-2 py-1 text-xs font-bold tracking-wide">
                              {product.category.toUpperCase()}
                            </span>
                          </div>
                        </div>
                        
                        <div className="p-6">
                          <h3 className="font-bold text-lg mb-2 tracking-wide">
                            {product.name}
                          </h3>
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                            {product.description}
                          </p>
                          <div className="flex justify-between items-center">
                            <span className="text-2xl font-bold">₹{product.price}</span>
                            <div className="flex space-x-1">
                              {product.sizes.map((size) => (
                                <span key={size} className="text-xs bg-gray-100 px-2 py-1 rounded">
                                  {size}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
