
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useStore } from '@/store/useStore';

const Home = () => {
  const { products } = useStore();
  
  // Get latest products (newest first)
  const newArrivals = products
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-black text-white py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black via-gray-900 to-black opacity-90"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <h1 className="text-6xl md:text-8xl font-bold tracking-wider mb-6 animate-fade-in">
              FIFTY-FIVE
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-300 max-w-2xl mx-auto">
              Premium streetwear that defines your style. Bold. Minimalist. Unforgettable.
            </p>
            <Link to="/products/all">
              <Button 
                size="lg" 
                className="bg-white text-black hover:bg-gray-200 text-lg px-8 py-4 font-semibold tracking-wide"
              >
                SHOP NOW
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 tracking-wide">
            COLLECTIONS
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'CARGOS', path: '/products/Cargos', image: '/placeholder-cargo.jpg' },
              { name: 'JACKETS', path: '/products/Jackets', image: '/placeholder-jacket.jpg' },
              { name: 'T-SHIRTS', path: '/products/T-Shirts', image: '/placeholder-tshirt.jpg' }
            ].map((category) => (
              <Link key={category.name} to={category.path}>
                <Card className="group cursor-pointer border-2 border-black hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                  <CardContent className="p-0">
                    <div className="h-80 bg-gray-100 relative overflow-hidden">
                      <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-6xl font-bold text-gray-400 group-hover:text-black transition-colors">
                          {category.name}
                        </span>
                      </div>
                    </div>
                    <div className="p-6 text-center">
                      <h3 className="text-2xl font-bold tracking-wide">
                        {category.name}
                      </h3>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals Section */}
      {newArrivals.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-12 tracking-wide">
              NEW ARRIVALS
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {newArrivals.map((product) => (
                <Link key={product.id} to={`/product/${product.id}`}>
                  <Card className="group cursor-pointer border border-gray-300 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                    <CardContent className="p-0">
                      <div className="h-64 bg-gray-200 relative overflow-hidden">
                        {product.images[0] ? (
                          <img 
                            src={product.images[0]} 
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-gray-400">
                            No Image
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                        <p className="text-xl font-bold">₹{product.price}</p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-black text-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h3 className="text-3xl font-bold mb-4 tracking-wider">FIFTY-FIVE</h3>
            <p className="text-gray-400 max-w-md mx-auto">
              Premium streetwear brand defining modern urban fashion with minimalist design and bold statements.
            </p>
            <div className="mt-8 pt-8 border-t border-gray-800">
              <p className="text-gray-500">
                © 2025 Fifty-Five. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
