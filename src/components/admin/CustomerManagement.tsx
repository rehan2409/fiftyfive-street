
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCustomerData, CustomerData } from '@/hooks/useCustomerData';
import { useAllTargetedCoupons } from '@/hooks/useTargetedCoupons';
import CustomerDetailModal from './CustomerDetailModal';
import AssignCouponModal from './AssignCouponModal';
import { Search, Users, UserCheck, UserX, Star, UserPlus, Gift, Loader2 } from 'lucide-react';

type FilterType = 'all' | 'active' | 'inactive' | 'new' | 'high-value';

const CustomerManagement = () => {
  const { data: customers = [], isLoading } = useCustomerData();
  const { data: targetedCoupons = [] } = useAllTargetedCoupons();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [sortBy, setSortBy] = useState<'name' | 'signup' | 'spent' | 'orders'>('signup');
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerData | null>(null);
  const [assignCouponCustomer, setAssignCouponCustomer] = useState<CustomerData | null>(null);

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const filtered = useMemo(() => {
    let result = customers;

    // Search
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        (c.phone && c.phone.includes(q))
      );
    }

    // Filter
    switch (filter) {
      case 'active': result = result.filter(c => c.isActive); break;
      case 'inactive': result = result.filter(c => !c.isActive); break;
      case 'new': result = result.filter(c => new Date(c.signupDate) > sevenDaysAgo); break;
      case 'high-value': result = result.filter(c => c.isHighValue); break;
    }

    // Sort
    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case 'name': return a.name.localeCompare(b.name);
        case 'signup': return new Date(b.signupDate).getTime() - new Date(a.signupDate).getTime();
        case 'spent': return b.totalSpent - a.totalSpent;
        case 'orders': return b.totalOrders - a.totalOrders;
        default: return 0;
      }
    });

    return result;
  }, [customers, search, filter, sortBy]);

  const stats = useMemo(() => ({
    total: customers.length,
    active: customers.filter(c => c.isActive).length,
    inactive: customers.filter(c => !c.isActive).length,
    highValue: customers.filter(c => c.isHighValue).length,
    newSignups: customers.filter(c => new Date(c.signupDate) > sevenDaysAgo).length,
  }), [customers]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'All Customers', value: stats.total, icon: Users, color: 'from-blue-500 to-blue-600', filter: 'all' as FilterType },
          { label: 'Active', value: stats.active, icon: UserCheck, color: 'from-green-500 to-green-600', filter: 'active' as FilterType },
          { label: 'Inactive', value: stats.inactive, icon: UserX, color: 'from-red-500 to-red-600', filter: 'inactive' as FilterType },
          { label: 'New Signups', value: stats.newSignups, icon: UserPlus, color: 'from-purple-500 to-purple-600', filter: 'new' as FilterType },
          { label: 'High Value', value: stats.highValue, icon: Star, color: 'from-amber-500 to-amber-600', filter: 'high-value' as FilterType },
        ].map((stat) => (
          <Card
            key={stat.label}
            className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 ${filter === stat.filter ? 'ring-2 ring-primary' : ''}`}
            onClick={() => setFilter(stat.filter)}
          >
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                <stat.icon className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search & Sort */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="signup">Signup Date</SelectItem>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="spent">Total Spent</SelectItem>
            <SelectItem value="orders">Total Orders</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Customer Table */}
      <Card className="bg-white/80 backdrop-blur-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-3 font-medium">Customer</th>
                  <th className="text-left p-3 font-medium hidden md:table-cell">Phone</th>
                  <th className="text-left p-3 font-medium hidden lg:table-cell">Signup Date</th>
                  <th className="text-center p-3 font-medium">Orders</th>
                  <th className="text-right p-3 font-medium">Total Spent</th>
                  <th className="text-left p-3 font-medium hidden xl:table-cell">Last Purchase</th>
                  <th className="text-center p-3 font-medium">Status</th>
                  <th className="text-right p-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-12 text-muted-foreground">
                      No customers found
                    </td>
                  </tr>
                ) : (
                  filtered.map((customer) => {
                    const customerCoupons = targetedCoupons.filter(c => c.customerEmail === customer.email);
                    return (
                      <tr
                        key={customer.email}
                        className="border-b hover:bg-muted/30 transition-colors cursor-pointer"
                        onClick={() => setSelectedCustomer(customer)}
                      >
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-rose-500 flex items-center justify-center text-white font-bold text-sm">
                              {customer.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-medium flex items-center gap-1">
                                {customer.name}
                                {customer.isHighValue && <Star className="h-3 w-3 text-amber-500 fill-amber-500" />}
                              </p>
                              <p className="text-xs text-muted-foreground">{customer.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-3 hidden md:table-cell text-muted-foreground">
                          {customer.phone || '—'}
                        </td>
                        <td className="p-3 hidden lg:table-cell text-muted-foreground">
                          {new Date(customer.signupDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          <br />
                          <span className="text-xs">{new Date(customer.signupDate).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                        </td>
                        <td className="p-3 text-center font-semibold">{customer.totalOrders}</td>
                        <td className="p-3 text-right font-semibold">₹{customer.totalSpent.toFixed(0)}</td>
                        <td className="p-3 hidden xl:table-cell">
                          {customer.lastPurchaseDate ? (
                            <div>
                              <p className="text-xs">{customer.lastPurchaseProducts.join(', ')}</p>
                              <p className="text-xs text-muted-foreground">
                                ₹{customer.lastPurchaseValue} · {customer.lastPurchaseStatus}
                              </p>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </td>
                        <td className="p-3 text-center">
                          <Badge variant={customer.isActive ? 'default' : 'secondary'} className={customer.isActive ? 'bg-green-100 text-green-700 border-green-200' : ''}>
                            {customer.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                          {customerCoupons.length > 0 && (
                            <Badge variant="outline" className="ml-1 bg-purple-50 text-purple-700 border-purple-200">
                              <Gift className="h-3 w-3 mr-1" />{customerCoupons.length}
                            </Badge>
                          )}
                        </td>
                        <td className="p-3 text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            className="bg-gradient-to-r from-violet-500 to-rose-500 text-white border-0 hover:opacity-90"
                            onClick={(e) => {
                              e.stopPropagation();
                              setAssignCouponCustomer(customer);
                            }}
                          >
                            <Gift className="h-3 w-3 mr-1" />
                            Assign Coupon
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      {selectedCustomer && (
        <CustomerDetailModal
          customer={selectedCustomer}
          targetedCoupons={targetedCoupons.filter(c => c.customerEmail === selectedCustomer.email)}
          onClose={() => setSelectedCustomer(null)}
          onAssignCoupon={() => {
            setAssignCouponCustomer(selectedCustomer);
          }}
        />
      )}

      {assignCouponCustomer && (
        <AssignCouponModal
          customer={assignCouponCustomer}
          onClose={() => setAssignCouponCustomer(null)}
        />
      )}
    </div>
  );
};

export default CustomerManagement;
