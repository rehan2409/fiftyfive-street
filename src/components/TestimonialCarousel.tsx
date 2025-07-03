
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';

const testimonials = [
  {
    id: 1,
    name: 'Arjun Sharma',
    rating: 5,
    text: 'Amazing quality cargos! The fit is perfect and the material feels premium. Definitely ordering more.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    product: 'Cargo Pants'
  },
  {
    id: 2,
    name: 'Priya Patel',
    rating: 5,
    text: 'The jacket I ordered exceeded my expectations. Great customer service and fast delivery!',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
    product: 'Denim Jacket'
  },
  {
    id: 3,
    name: 'Rohit Kumar',
    rating: 5,
    text: 'Best streetwear brand in India! The t-shirts are so comfortable and stylish.',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    product: 'Basic T-Shirt'
  }
];

const TestimonialCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12 animate-fade-in">
          What Our Customers Say
        </h2>
        
        <div className="relative max-w-4xl mx-auto">
          <div className="bg-gray-50 rounded-2xl p-8 md:p-12 shadow-lg animate-fade-in-up">
            <Quote className="h-12 w-12 text-gray-400 mb-6 animate-bounce-in" />
            
            <div className="mb-6">
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-500 fill-current animate-scale-in" style={{ animationDelay: `${i * 0.1}s` }} />
                ))}
              </div>
              
              <p className="text-lg md:text-xl text-gray-800 mb-6 leading-relaxed animate-fade-in">
                "{testimonials[currentIndex].text}"
              </p>
            </div>
            
            <div className="flex items-center space-x-4 animate-fade-in-right">
              <img
                src={testimonials[currentIndex].image}
                alt={testimonials[currentIndex].name}
                className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-lg"
              />
              <div>
                <h4 className="font-semibold text-lg">{testimonials[currentIndex].name}</h4>
                <p className="text-gray-600">Purchased: {testimonials[currentIndex].product}</p>
              </div>
            </div>
          </div>
          
          {/* Navigation */}
          <div className="flex items-center justify-center mt-8 space-x-4">
            <Button
              variant="outline"
              size="icon"
              onClick={prevTestimonial}
              className="rounded-full hover:bg-black hover:text-white transition-all duration-300 animate-fade-in"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <div className="flex space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex ? 'bg-black scale-125' : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
            
            <Button
              variant="outline"
              size="icon"
              onClick={nextTestimonial}
              className="rounded-full hover:bg-black hover:text-white transition-all duration-300 animate-fade-in"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialCarousel;
