import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { ShoppingCart, Heart, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useStore } from '@/store/useStore';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    description?: string;
    images?: string[];
    category: string;
    sizes?: string[];
    createdAt?: string;
  };
  onAddToCart?: (product: any) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const { addToCart } = useStore();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    // Add with default size 'M' and quantity 1
    const cartItem = {
      productId: product.id,
      product: {
        ...product,
        createdAt: product.createdAt || new Date().toISOString()
      },
      size: 'M',
      quantity: 1
    };
    addToCart(cartItem);
    onAddToCart?.(product);
  };

  return (
    <Card className="group cursor-pointer border border-gray-300 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 hover:scale-105 animate-fade-in-up overflow-hidden">
      <CardContent className="p-0 relative">
        <div className="h-64 bg-gray-200 relative overflow-hidden">
          {product.images && product.images[0] ? (
            <img 
              src={product.images[0]} 
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              No Image
            </div>
          )}
          
          {/* Overlay with action buttons */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-500 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <div className="flex space-x-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
              <Button
                size="icon"
                variant="secondary"
                className="rounded-full bg-white hover:bg-gray-100 animate-bounce-in"
                style={{ animationDelay: '0.1s' }}
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="secondary"
                className="rounded-full bg-white hover:bg-gray-100 animate-bounce-in"
                style={{ animationDelay: '0.2s' }}
                onClick={handleAddToCart}
              >
                <ShoppingCart className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="secondary"
                className="rounded-full bg-white hover:bg-gray-100 animate-bounce-in"
                style={{ animationDelay: '0.3s' }}
              >
                <Heart className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Badge */}
          <div className="absolute top-2 right-2 bg-black text-white px-3 py-1 text-xs rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-4 group-hover:translate-x-0">
            NEW
          </div>
        </div>
        
        <Link to={`/product/${product.id}`}>
          <div className="p-4 bg-white group-hover:bg-gray-50 transition-colors duration-300">
            <h3 className="font-semibold text-lg mb-2 group-hover:text-gray-700 transition-colors">
              {product.name}
            </h3>
            <p className="text-xl font-bold text-black group-hover:text-gray-800 transition-colors">
              ₹{product.price}
            </p>
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
              {product.description}
            </p>
          </div>
        </Link>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
