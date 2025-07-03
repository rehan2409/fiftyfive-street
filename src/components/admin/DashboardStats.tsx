
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AnimatedCounter from '../AnimatedCounter';
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Package } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number;
  change: number;
  icon: React.ElementType;
  prefix?: string;
  suffix?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon: Icon, prefix, suffix }) => {
  const isPositive = change >= 0;
  
  return (
    <Card className="hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 animate-fade-in-up">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
        <Icon className="h-4 w-4 text-gray-600 animate-float" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold mb-1">
          <AnimatedCounter end={value} prefix={prefix} suffix={suffix} />
        </div>
        <div className={`flex items-center text-xs ${
          isPositive ? 'text-green-600' : 'text-red-600'
        }`}>
          {isPositive ? (
            <TrendingUp className="h-3 w-3 mr-1" />
          ) : (
            <TrendingDown className="h-3 w-3 mr-1" />
          )}
          <span>{Math.abs(change)}% from last month</span>
        </div>
      </CardContent>
    </Card>
  );
};

const DashboardStats = () => {
  const stats = [
    {
      title: 'Total Revenue',
      value: 125000,
      change: 12.5,
      icon: DollarSign,
      prefix: '₹'
    },
    {
      title: 'Total Orders',
      value: 350,
      change: 8.2,
      icon: ShoppingCart
    },
    {
      title: 'Active Customers',
      value: 1250,
      change: 15.3,
      icon: Users
    },
    {
      title: 'Products Sold',
      value: 890,
      change: -2.1,
      icon: Package
    }
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
      {stats.map((stat, index) => (
        <div
          key={stat.title}
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <StatCard {...stat} />
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;
