
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useStore } from '@/store/useStore';
import { Truck, Shield, RefreshCw, Star, Phone, Mail, Instagram } from 'lucide-react';
import StatsSection from '@/components/StatsSection';
import TestimonialCarousel from '@/components/TestimonialCarousel';
import ProductCard from '@/components/ProductCard';

const Home = () => {
  const { products, addToCart } = useStore();
  
  // Get latest products (newest first)
  const newArrivals = products
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);

  const handleInstagramClick = () => {
    window.open('https://instagram.com/the.fifty.five', '_blank');
  };

  const handleAddToCart = (product: any) => {
    addToCart({
      productId: product.id,
      product,
      size: 'M', // Default size
      quantity: 1
    });
    alert('Added to cart!');
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-black text-white py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black via-gray-900 to-black opacity-90"></div>
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white opacity-10 rounded-full animate-float"></div>
          <div className="absolute top-32 right-20 w-16 h-16 bg-white opacity-10 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-white opacity-10 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <h1 className="text-6xl md:text-8xl font-bold tracking-wider mb-6 animate-fade-in">
              FIFTY-FIVE
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-300 max-w-2xl mx-auto animate-fade-in-delay">
              Premium streetwear that defines your style. Bold. Minimalist. Unforgettable.
            </p>
            <Link to="/products/all">
              <Button 
                size="lg" 
                className="bg-white text-black hover:bg-gray-200 text-lg px-8 py-4 font-semibold tracking-wide animate-bounce-in hover:scale-105 transition-all duration-300"
              >
                SHOP NOW
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: Truck, title: 'Free Shipping', desc: 'On orders over ₹999' },
              { icon: Shield, title: 'Secure Payment', desc: '100% secure transactions' },
              { icon: RefreshCw, title: 'Easy Returns', desc: '30-day return policy' },
              { icon: Star, title: 'Quality Guarantee', desc: 'Premium materials only' }
            ].map((feature, index) => (
              <div 
                key={feature.title} 
                className="text-center p-6 animate-fade-in-up hover:transform hover:scale-105 transition-all duration-300 bg-white rounded-lg shadow-sm hover:shadow-md"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <feature.icon className="h-8 w-8 mx-auto mb-4 text-black animate-bounce-in" />
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <StatsSection />

      {/* Categories Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 tracking-wide animate-fade-in">
            COLLECTIONS
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                name: 'CARGOS', 
                path: '/products/Cargos', 
                image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=300&fit=crop',
                description: 'Comfortable utility pants for everyday wear'
              },
              { 
                name: 'JACKETS', 
                path: '/products/Jackets', 
                image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=300&fit=crop',
                description: 'Premium outerwear for all seasons'
              },
              { 
                name: 'T-SHIRTS', 
                path: '/products/T-Shirts', 
                image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=300&fit=crop',
                description: 'Essential basics in premium cotton'
              }
            ].map((category, index) => (
              <Link key={category.name} to={category.path}>
                <Card className="group cursor-pointer border-2 border-black hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 animate-fade-in-up hover:animate-pulse-slow overflow-hidden">
                  <CardContent className="p-0">
                    <div className="h-80 relative overflow-hidden">
                      <img 
                        src={category.image} 
                        alt={category.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-500"></div>
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-500">
                        <span className="text-4xl font-bold mb-2 animate-bounce-in transform translate-y-4 group-hover:translate-y-0 transition-transform duration-700">
                          {category.name}
                        </span>
                        <p className="text-center px-4 animate-fade-in-delay transform translate-y-4 group-hover:translate-y-0 transition-transform duration-700">
                          {category.description}
                        </p>
                        <Button className="mt-4 bg-white text-black hover:bg-gray-200 animate-scale-in transform translate-y-4 group-hover:translate-y-0 transition-transform duration-700">
                          Shop Now
                        </Button>
                      </div>
                    </div>
                    <div className="p-6 text-center bg-white group-hover:bg-gray-50 transition-colors duration-300">
                      <h3 className="text-2xl font-bold tracking-wide group-hover:text-gray-600 transition-colors">
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
            <h2 className="text-4xl font-bold text-center mb-12 tracking-wide animate-fade-in">
              NEW ARRIVALS
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {newArrivals.map((product, index) => (
                <div
                  key={product.id}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <ProductCard 
                    product={product} 
                    onAddToCart={handleAddToCart}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials Section */}
      <TestimonialCarousel />

      {/* Newsletter Section */}
      <section className="py-16 bg-black text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4 animate-fade-in">STAY UPDATED</h2>
          <p className="text-gray-300 mb-8 animate-fade-in-delay">Subscribe to get exclusive offers and latest drops</p>
          <div className="max-w-md mx-auto flex gap-4 animate-fade-in-up">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="flex-1 px-4 py-3 bg-white text-black rounded transition-all duration-300 focus:scale-105 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <Button className="bg-white text-black hover:bg-gray-200 px-6 py-3 hover:scale-105 transition-all duration-300">
              Subscribe
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div className="animate-fade-in">
              <h3 className="text-3xl font-bold mb-4 tracking-wider">FIFTY-FIVE</h3>
              <p className="text-gray-400 mb-4">
                Premium streetwear brand defining modern urban fashion with minimalist design and bold statements.
              </p>
            </div>

            {/* Quick Links */}
            <div className="animate-fade-in-delay">
              <h4 className="text-lg font-semibold mb-4">QUICK LINKS</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/products/all" className="hover:text-white transition-colors">All Products</Link></li>
                <li><Link to="/products/Cargos" className="hover:text-white transition-colors">Cargos</Link></li>
                <li><Link to="/products/Jackets" className="hover:text-white transition-colors">Jackets</Link></li>
                <li><Link to="/products/T-Shirts" className="hover:text-white transition-colors">T-Shirts</Link></li>
              </ul>
            </div>

            {/* Customer Service */}
            <div className="animate-fade-in-up">
              <h4 className="text-lg font-semibold mb-4">CUSTOMER SERVICE</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/account" className="hover:text-white transition-colors">My Account</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">Size Guide</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Returns</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="animate-fade-in-right">
              <h4 className="text-lg font-semibold mb-4">CONTACT US</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-gray-400 hover:text-white transition-colors group">
                  <Phone className="h-4 w-4 group-hover:animate-bounce" />
                  <span>8446421463</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-400 hover:text-white transition-colors group">
                  <Mail className="h-4 w-4 group-hover:animate-bounce" />
                  <span>fiftyfivestreetwear@gmail.com</span>
                </div>
                <button
                  onClick={handleInstagramClick}
                  className="flex items-center space-x-3 text-gray-400 hover:text-white transition-all duration-300 transform hover:scale-105 group"
                >
                  <Instagram className="h-4 w-4 group-hover:animate-bounce" />
                  <span>@the.fifty.five</span>
                </button>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-800 text-center">
            <p className="text-gray-500 animate-fade-in">
              © 2025 Fifty-Five. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
