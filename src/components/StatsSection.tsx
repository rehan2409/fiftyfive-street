
import React from 'react';
import AnimatedCounter from './AnimatedCounter';
import { Users, ShoppingBag, Star, Award } from 'lucide-react';

const StatsSection = () => {
  const stats = [
    {
      icon: Users,
      value: 5000,
      suffix: '+',
      label: 'Happy Customers',
      color: 'text-blue-600'
    },
    {
      icon: ShoppingBag,
      value: 12000,
      suffix: '+',
      label: 'Orders Delivered',
      color: 'text-green-600'
    },
    {
      icon: Star,
      value: 4.9,
      suffix: '/5',
      label: 'Customer Rating',
      color: 'text-yellow-600'
    },
    {
      icon: Award,
      value: 50,
      suffix: '+',
      label: 'Awards Won',
      color: 'text-purple-600'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-r from-gray-50 to-gray-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 animate-fade-in">
            Why Choose FIFTY-FIVE?
          </h2>
          <p className="text-gray-600 text-lg animate-fade-in-delay">
            Numbers that speak for themselves
          </p>
        </div>
        
        <div className="grid md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div 
              key={stat.label}
              className="text-center p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4 ${stat.color} animate-float`}>
                <stat.icon className="h-8 w-8" />
              </div>
              <AnimatedCounter 
                end={stat.value} 
                suffix={stat.suffix}
                duration={2000 + (index * 200)}
              />
              <p className="text-gray-600 mt-2 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
