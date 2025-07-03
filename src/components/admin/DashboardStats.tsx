
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AnimatedCounter from '../AnimatedCounter';
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Package } from 'lucide-react';
import { useStore } from '@/store/useStore';

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
  const { orders, products } = useStore();

  // Calculate real statistics
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = orders.length;
  const totalProducts = products.length;
  const totalProductsSold = orders.reduce((sum, order) => 
    sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0
  );

  // Get unique customers
  const uniqueCustomers = new Set(orders.map(order => order.customerInfo.email)).size;

  const stats = [
    {
      title: 'Total Revenue',
      value: totalRevenue,
      change: 0, // Would need historical data to calculate
      icon: DollarSign,
      prefix: '₹'
    },
    {
      title: 'Total Orders',
      value: totalOrders,
      change: 0,
      icon: ShoppingCart
    },
    {
      title: 'Active Customers',
      value: uniqueCustomers,
      change: 0,
      icon: Users
    },
    {
      title: 'Products Sold',
      value: totalProductsSold,
      change: 0,
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
