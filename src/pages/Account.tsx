import React, { useState } from 'react';
import { useStore } from '@/store/useStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { User, Package, Download, Edit3, Save, X, MapPin, Phone, Mail, Calendar, ShoppingBag, Truck, CheckCircle, Clock } from 'lucide-react';
import { generateInvoicePDF } from '@/utils/invoiceGenerator';
import { useOrders } from '@/hooks/useSupabaseOrders';
import { toast } from 'sonner';

const Account = () => {
  const { user, setUser } = useStore();
  const { data: allOrders = [], isLoading } = useOrders();
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
  });
  
  // Filter orders by user email
  const userOrders = allOrders.filter(order => 
    order.customerInfo?.email === user?.email
  );

  const handleDownloadInvoice = (order: any) => {
    generateInvoicePDF(order);
  };

  const handleSaveProfile = () => {
    if (!user) return;
    
    if (!editedProfile.name.trim()) {
      toast.error('Name cannot be empty');
      return;
    }
    
    setUser({
      ...user,
      name: editedProfile.name.trim(),
      phone: editedProfile.phone.trim(),
      address: editedProfile.address.trim(),
    });
    
    setIsEditing(false);
    toast.success('Profile updated successfully!');
  };

  const handleCancelEdit = () => {
    setEditedProfile({
      name: user?.name || '',
      phone: user?.phone || '',
      address: user?.address || '',
    });
    setIsEditing(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Processing': return <Clock className="h-4 w-4" />;
      case 'Packed': return <Package className="h-4 w-4" />;
      case 'Out for Delivery': return <Truck className="h-4 w-4" />;
      case 'Delivered': return <CheckCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Processing': return 'bg-amber-500/20 text-amber-600 border-amber-500/30';
      case 'Packed': return 'bg-blue-500/20 text-blue-600 border-blue-500/30';
      case 'Out for Delivery': return 'bg-purple-500/20 text-purple-600 border-purple-500/30';
      case 'Delivered': return 'bg-emerald-500/20 text-emerald-600 border-emerald-500/30';
      default: return 'bg-gray-500/20 text-gray-600 border-gray-500/30';
    }
  };

  const getStatusStep = (status: string) => {
    switch (status) {
      case 'Processing': return 1;
      case 'Packed': return 2;
      case 'Out for Delivery': return 3;
      case 'Delivered': return 4;
      default: return 0;
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 via-white to-rose-50">
        <div className="text-center p-8 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-violet-500 to-rose-500 rounded-full flex items-center justify-center">
            <User className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-rose-600 bg-clip-text text-transparent mb-2">Welcome Back!</h2>
          <p className="text-muted-foreground">Please sign in to view your account</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-slate-50 to-rose-50">
      {/* Decorative Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-300/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-rose-300/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-violet-200/10 to-rose-200/10 rounded-full blur-3xl" />
      </div>
      
      <div className="relative container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-violet-500 via-purple-500 to-rose-500 rounded-2xl shadow-lg shadow-violet-500/30 mb-4 transform hover:scale-110 transition-transform duration-300">
            <User className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-rose-600 bg-clip-text text-transparent mb-2">
            My Dashboard
          </h1>
          <p className="text-muted-foreground text-lg">Manage your profile and track your orders</p>
        </div>

        <div className="max-w-6xl mx-auto grid lg:grid-cols-5 gap-8">
          {/* Profile Card - Takes 2 columns */}
          <div className="lg:col-span-2">
            <Card className="bg-white/70 backdrop-blur-xl border-0 shadow-xl shadow-violet-500/5 overflow-hidden group hover:shadow-2xl hover:shadow-violet-500/10 transition-all duration-500">
              <div className="h-24 bg-gradient-to-r from-violet-500 via-purple-500 to-rose-500 relative">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] bg-[length:20px_20px]" />
              </div>
              
              <div className="relative px-6 pb-6">
                {/* Avatar */}
                <div className="w-24 h-24 -mt-12 mx-auto bg-gradient-to-br from-violet-400 to-rose-400 rounded-2xl flex items-center justify-center shadow-lg ring-4 ring-white">
                  <span className="text-3xl font-bold text-white">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                
                <CardHeader className="text-center pt-4 pb-2">
                  <CardTitle className="text-xl font-semibold text-foreground flex items-center justify-center gap-2">
                    Profile Information
                    {!isEditing && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-violet-600 hover:text-violet-700 hover:bg-violet-100"
                        onClick={() => setIsEditing(true)}
                      >
                        <Edit3 className="h-4 w-4" />
                      </Button>
                    )}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {isEditing ? (
                    <>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-muted-foreground">Name</Label>
                        <Input
                          value={editedProfile.name}
                          onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                          className="bg-white/50 border-violet-200 focus:border-violet-400"
                          placeholder="Enter your name"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                          <Mail className="h-3.5 w-3.5" /> Email (cannot be changed)
                        </Label>
                        <Input
                          value={user.email}
                          disabled
                          className="bg-muted/50 border-muted cursor-not-allowed"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                          <Phone className="h-3.5 w-3.5" /> Phone Number
                        </Label>
                        <Input
                          value={editedProfile.phone}
                          onChange={(e) => setEditedProfile({ ...editedProfile, phone: e.target.value })}
                          className="bg-white/50 border-violet-200 focus:border-violet-400"
                          placeholder="Enter your phone number"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                          <MapPin className="h-3.5 w-3.5" /> Address
                        </Label>
                        <Textarea
                          value={editedProfile.address}
                          onChange={(e) => setEditedProfile({ ...editedProfile, address: e.target.value })}
                          className="bg-white/50 border-violet-200 focus:border-violet-400 min-h-[80px]"
                          placeholder="Enter your delivery address"
                        />
                      </div>
                      
                      <div className="flex gap-2 pt-2">
                        <Button
                          onClick={handleSaveProfile}
                          className="flex-1 bg-gradient-to-r from-violet-500 to-rose-500 hover:from-violet-600 hover:to-rose-600 text-white shadow-lg"
                        >
                          <Save className="h-4 w-4 mr-2" /> Save
                        </Button>
                        <Button
                          variant="outline"
                          onClick={handleCancelEdit}
                          className="flex-1"
                        >
                          <X className="h-4 w-4 mr-2" /> Cancel
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-100">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
                          <User className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground font-medium">Name</p>
                          <p className="font-semibold text-foreground">{user.name}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-100">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center">
                          <Mail className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground font-medium">Email</p>
                          <p className="font-semibold text-foreground">{user.email}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                          <Phone className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground font-medium">Phone</p>
                          <p className="font-semibold text-foreground">{user.phone || 'Not added yet'}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3 p-3 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center flex-shrink-0">
                          <MapPin className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground font-medium">Address</p>
                          <p className="font-semibold text-foreground">{user.address || 'Not added yet'}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </div>
            </Card>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-4 border-0 shadow-lg shadow-violet-500/5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
                    <ShoppingBag className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{userOrders.length}</p>
                    <p className="text-xs text-muted-foreground">Total Orders</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-4 border-0 shadow-lg shadow-rose-500/5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">
                      {userOrders.filter(o => o.status === 'Delivered').length}
                    </p>
                    <p className="text-xs text-muted-foreground">Delivered</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order History - Takes 3 columns */}
          <div className="lg:col-span-3">
            <Card className="bg-white/70 backdrop-blur-xl border-0 shadow-xl shadow-violet-500/5">
              <CardHeader className="border-b border-violet-100/50 pb-4">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-rose-500 flex items-center justify-center">
                    <Package className="h-5 w-5 text-white" />
                  </div>
                  <span className="bg-gradient-to-r from-violet-600 to-rose-600 bg-clip-text text-transparent">
                    Order History & Tracking
                  </span>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="pt-6">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-16">
                    <div className="w-16 h-16 rounded-full border-4 border-violet-200 border-t-violet-500 animate-spin" />
                    <p className="mt-4 text-muted-foreground">Loading your orders...</p>
                  </div>
                ) : userOrders.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-violet-100 to-rose-100 rounded-full flex items-center justify-center">
                      <ShoppingBag className="h-12 w-12 text-violet-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">No orders yet</h3>
                    <p className="text-muted-foreground">Start shopping to see your orders here!</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {userOrders.map((order, index) => (
                      <div 
                        key={order.id} 
                        className="bg-gradient-to-br from-white to-violet-50/30 rounded-2xl border border-violet-100/50 overflow-hidden hover:shadow-lg hover:shadow-violet-500/10 transition-all duration-300 animate-fade-in"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        {/* Order Header */}
                        <div className="p-4 bg-gradient-to-r from-violet-50/50 to-rose-50/50 border-b border-violet-100/30">
                          <div className="flex flex-wrap items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-rose-500 flex items-center justify-center text-white font-bold">
                                #{index + 1}
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Order ID</p>
                                <p className="font-mono text-sm font-medium">{order.id.slice(0, 8)}...</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                  <Calendar className="h-3 w-3" /> Date
                                </p>
                                <p className="text-sm font-medium">
                                  {new Date(order.createdAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric'
                                  })}
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-3">
                              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${getStatusColor(order.status)}`}>
                                {getStatusIcon(order.status)}
                                {order.status}
                              </span>
                              <div className="text-right">
                                <p className="text-xs text-muted-foreground">Total</p>
                                <p className="text-lg font-bold bg-gradient-to-r from-violet-600 to-rose-600 bg-clip-text text-transparent">
                                  ₹{order.total.toLocaleString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Progress Tracker */}
                        <div className="px-4 py-4 bg-white/50">
                          <div className="flex items-center justify-between relative">
                            <div className="absolute top-5 left-6 right-6 h-1 bg-violet-100 rounded-full">
                              <div 
                                className="h-full bg-gradient-to-r from-violet-500 to-rose-500 rounded-full transition-all duration-500"
                                style={{ width: `${(getStatusStep(order.status) / 4) * 100}%` }}
                              />
                            </div>
                            
                            {['Processing', 'Packed', 'Out for Delivery', 'Delivered'].map((step, stepIndex) => (
                              <div key={step} className="relative z-10 flex flex-col items-center">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                                  getStatusStep(order.status) >= stepIndex + 1
                                    ? 'bg-gradient-to-br from-violet-500 to-rose-500 text-white shadow-lg shadow-violet-500/30'
                                    : 'bg-violet-100 text-violet-400'
                                }`}>
                                  {stepIndex === 0 && <Clock className="h-4 w-4" />}
                                  {stepIndex === 1 && <Package className="h-4 w-4" />}
                                  {stepIndex === 2 && <Truck className="h-4 w-4" />}
                                  {stepIndex === 3 && <CheckCircle className="h-4 w-4" />}
                                </div>
                                <span className="text-[10px] text-muted-foreground mt-2 text-center w-16">{step}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        {/* Order Items */}
                        <div className="p-4">
                          <p className="text-sm font-medium text-muted-foreground mb-3">Items Ordered</p>
                          <div className="space-y-2">
                            {order.items.map((item, itemIndex) => (
                              <div key={itemIndex} className="flex items-center justify-between p-3 bg-white/70 rounded-xl border border-violet-50">
                                <div className="flex items-center gap-3">
                                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-violet-100 to-rose-100 flex items-center justify-center">
                                    <ShoppingBag className="h-5 w-5 text-violet-500" />
                                  </div>
                                  <div>
                                    <p className="font-medium text-foreground">{item.product.name}</p>
                                    <p className="text-xs text-muted-foreground">Size: {item.size}</p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="font-semibold">₹{item.product.price}</p>
                                  <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        {/* Download Invoice */}
                        <div className="px-4 pb-4">
                          <Button 
                            onClick={() => handleDownloadInvoice(order)}
                            className="w-full bg-gradient-to-r from-violet-500 to-rose-500 hover:from-violet-600 hover:to-rose-600 text-white shadow-lg shadow-violet-500/20 hover:shadow-xl hover:shadow-violet-500/30 transition-all duration-300"
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download Invoice
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
