
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Star, Truck, Shield, RefreshCw } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import ThreeAnimation from '@/components/ThreeAnimation';
import { useProducts } from '@/hooks/useSupabaseProducts';
import { useToast } from '@/hooks/use-toast';

const Home = () => {
  const { data: products = [], isLoading } = useProducts();
  const { toast } = useToast();

  // Get featured products (latest 8 products)
  const featuredProducts = products
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 8);

  const handleAddToCart = (product: any) => {
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 animate-fade-in" variant="secondary">
              🔥 New Collection Available
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-slide-in-left">
              BLING
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                COLLECTIVE
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-300 animate-slide-in-right">
              Discover premium streetwear that defines your style. From edgy cargos to statement jackets.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up">
              <Link to="/products/all">
                <Button size="lg" className="text-lg px-8 py-3 bg-white text-black hover:bg-gray-200 transition-all transform hover:scale-105">
                  Shop Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/products/new">
                <Button variant="outline" size="lg" className="text-lg px-8 py-3 border-white text-white hover:bg-white hover:text-black transition-all transform hover:scale-105">
                  Explore Collection
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Animated background elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-white opacity-5 rounded-full animate-bounce"></div>
        <div className="absolute bottom-20 right-10 w-16 h-16 bg-white opacity-5 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-white opacity-5 rounded-full animate-bounce" style={{ animationDelay: '2s' }}></div>
      </section>

      {/* 3D Animation Section */}
      <section className="py-16 bg-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold mb-4 text-white animate-fade-in">Experience Innovation</h2>
            <p className="text-gray-300 text-lg animate-fade-in">Interactive 3D showcase of our brand</p>
          </div>
          <div className="animate-fade-in-up">
            <ThreeAnimation />
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 animate-fade-in">Shop by Category</h2>
            <p className="text-gray-600 text-lg animate-fade-in">Find your perfect style from our curated collections</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Cargos', image: '/placeholder.svg', description: 'Utility meets style' },
              { name: 'T-Shirts', image: '/placeholder.svg', description: 'Essential streetwear' },
              { name: 'Jackets', image: '/placeholder.svg', description: 'Layer up in style' }
            ].map((category, index) => (
              <Link key={category.name} to={`/products/${category.name.toLowerCase()}`}>
                <Card className="group cursor-pointer hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 animate-fade-in-up overflow-hidden" style={{ animationDelay: `${index * 0.2}s` }}>
                  <CardContent className="p-0">
                    <div className="h-64 bg-gradient-to-br from-gray-200 to-gray-300 relative overflow-hidden">
                      <img 
                        src={category.image} 
                        alt={category.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-500 flex items-center justify-center">
                        <Button className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                          Shop {category.name}
                        </Button>
                      </div>
                    </div>
                    <div className="p-6 text-center">
                      <h3 className="text-2xl font-bold mb-2 group-hover:text-gray-600 transition-colors">{category.name}</h3>
                      <p className="text-gray-600">{category.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Featured Products</h2>
            <p className="text-gray-600 text-lg">Handpicked items from our latest collection</p>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product, index) => (
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
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <p className="text-gray-500 mb-4">No products available at the moment.</p>
                <p className="text-sm text-gray-400">Check back soon for new arrivals!</p>
              </CardContent>
            </Card>
          )}

          <div className="text-center mt-12">
            <Link to="/products/all">
              <Button size="lg" className="px-8 py-3 bg-black text-white hover:bg-gray-800 transition-all transform hover:scale-105">
                View All Products
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Why Choose Bling Collective?</h2>
            <p className="text-gray-600 text-lg">Experience premium quality and exceptional service</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: Star, title: 'Premium Quality', description: 'Carefully selected materials and craftsmanship' },
              { icon: Truck, title: 'Fast Shipping', description: 'Quick delivery across India' },
              { icon: Shield, title: 'Secure Shopping', description: '100% secure payment processing' },
              { icon: RefreshCw, title: 'Easy Returns', description: 'Hassle-free return policy' }
            ].map(({ icon: Icon, title, description }, index) => (
              <Card key={title} className="text-center hover:shadow-lg transition-shadow animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardContent className="p-6">
                  <Icon className="h-12 w-12 mx-auto mb-4 text-black" />
                  <h3 className="text-xl font-semibold mb-2">{title}</h3>
                  <p className="text-gray-600">{description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-black text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Elevate Your Style?</h2>
          <p className="text-xl mb-8 text-gray-300">Join thousands of satisfied customers who trust Bling Collective</p>
          <Link to="/products/all">
            <Button size="lg" className="px-8 py-3 bg-white text-black hover:bg-gray-200 transition-all transform hover:scale-105">
              Start Shopping
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
