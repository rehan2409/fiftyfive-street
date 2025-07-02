
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useStore, Product } from '@/store/useStore';
import {
  BarChart3,
  Package,
  ShoppingCart,
  Users,
  Settings,
  LogOut,
  Plus,
  Edit,
  Trash2,
  Upload,
  Eye
} from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { isAdmin, setIsAdmin, orders, products, setProducts, updateOrderStatus, setCheckoutQR, checkoutQR } = useStore();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'Cargos' as Product['category'],
    description: '',
    price: '',
    sizes: [] as Product['sizes'],
    images: [] as string[]
  });
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    type: 'percentage' as 'percentage' | 'flat',
    value: '',
    maxUsages: '',
    expiryDate: ''
  });

  if (!isAdmin) {
    navigate('/admin');
    return null;
  }

  const handleLogout = () => {
    setIsAdmin(false);
    navigate('/');
  };

  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const pendingOrders = orders.filter(order => order.status === 'Processing').length;

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.price) return;
    
    const product: Product = {
      id: Date.now().toString(),
      name: newProduct.name,
      category: newProduct.category,
      description: newProduct.description,
      price: parseFloat(newProduct.price),
      sizes: newProduct.sizes,
      images: newProduct.images,
      createdAt: new Date().toISOString()
    };
    
    setProducts([...products, product]);
    setNewProduct({
      name: '',
      category: 'Cargos',
      description: '',
      price: '',
      sizes: [],
      images: []
    });
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts(products.filter(p => p.id !== productId));
  };

  const handleSizeToggle = (size: Product['sizes'][0]) => {
    setNewProduct(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size) 
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size]
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    Array.from(files).forEach(file => {
      if (file instanceof File) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const result = event.target?.result;
          if (typeof result === 'string') {
            setNewProduct(prev => ({
              ...prev,
              images: [...prev.images, result]
            }));
          }
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const handleQRUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file instanceof File) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result;
        if (typeof result === 'string') {
          setCheckoutQR(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateCoupon = () => {
    // In a real app, this would save to database
    console.log('Creating coupon:', newCoupon);
    setNewCoupon({
      code: '',
      type: 'percentage',
      value: '',
      maxUsages: '',
      expiryDate: ''
    });
    alert('Coupon created successfully!');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              <p className="text-gray-600">Fifty-Five Store Management</p>
            </div>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="flex items-center space-x-2"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="coupons">Coupons</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₹{totalRevenue}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalOrders}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{pendingOrders}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{products.length}</div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Orders */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                {orders.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No orders yet</p>
                ) : (
                  <div className="space-y-4">
                    {orders.slice(0, 5).map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">Order #{order.id}</p>
                          <p className="text-sm text-gray-600">{order.customerInfo.name}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">₹{order.total}</p>
                          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                            {order.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Management</CardTitle>
              </CardHeader>
              <CardContent>
                {orders.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No orders to display</p>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-bold">Order #{order.id}</h3>
                            <p className="text-sm text-gray-600">
                              Placed on {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                            <p className="text-sm">Customer: {order.customerInfo.name}</p>
                            <p className="text-sm">Email: {order.customerInfo.email}</p>
                            <p className="text-sm">Phone: {order.customerInfo.phone}</p>
                            <p className="text-sm">Address: {order.customerInfo.address}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-lg">₹{order.total}</p>
                            <Select
                              value={order.status}
                              onValueChange={(value) => updateOrderStatus(order.id, value as any)}
                            >
                              <SelectTrigger className="w-40">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Processing">Processing</SelectItem>
                                <SelectItem value="Packed">Packed</SelectItem>
                                <SelectItem value="Out for Delivery">Out for Delivery</SelectItem>
                                <SelectItem value="Delivered">Delivered</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <div className="border-t pt-4">
                          <h4 className="font-semibold mb-2">Items:</h4>
                          {order.items.map((item, index) => (
                            <div key={index} className="flex justify-between text-sm mb-1">
                              <span>{item.product.name} (Size: {item.size}) x {item.quantity}</span>
                              <span>₹{item.product.price * item.quantity}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Add New Product</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Product Name</label>
                    <Input
                      value={newProduct.name}
                      onChange={(e) => setNewProduct(prev => ({...prev, name: e.target.value}))}
                      placeholder="Product name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Category</label>
                    <Select
                      value={newProduct.category}
                      onValueChange={(value) => setNewProduct(prev => ({...prev, category: value as Product['category']}))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Cargos">Cargos</SelectItem>
                        <SelectItem value="Jackets">Jackets</SelectItem>
                        <SelectItem value="T-Shirts">T-Shirts</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <Input
                    value={newProduct.description}
                    onChange={(e) => setNewProduct(prev => ({...prev, description: e.target.value}))}
                    placeholder="Product description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Price (₹)</label>
                  <Input
                    type="number"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct(prev => ({...prev, price: e.target.value}))}
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Available Sizes</label>
                  <div className="flex space-x-2">
                    {(['S', 'M', 'L', 'XL', 'XXL'] as const).map((size) => (
                      <Button
                        key={size}
                        type="button"
                        variant={newProduct.sizes.includes(size) ? "default" : "outline"}
                        onClick={() => handleSizeToggle(size)}
                        className="min-w-[3rem]"
                      >
                        {size}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Product Images</label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-black file:text-white hover:file:bg-gray-800"
                  />
                  {newProduct.images.length > 0 && (
                    <div className="flex space-x-2 mt-2">
                      {newProduct.images.map((img, index) => (
                        <img key={index} src={img} alt={`Preview ${index}`} className="w-16 h-16 object-cover rounded" />
                      ))}
                    </div>
                  )}
                </div>

                <Button onClick={handleAddProduct} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Existing Products</CardTitle>
              </CardHeader>
              <CardContent>
                {products.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No products added yet</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {products.map((product) => (
                      <div key={product.id} className="border rounded-lg p-4">
                        <div className="aspect-square bg-gray-100 rounded mb-3 overflow-hidden">
                          {product.images[0] ? (
                            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="flex items-center justify-center h-full text-gray-400">No Image</div>
                          )}
                        </div>
                        <h3 className="font-semibold">{product.name}</h3>
                        <p className="text-sm text-gray-600">{product.category}</p>
                        <p className="font-bold">₹{product.price}</p>
                        <div className="flex justify-between mt-2">
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => handleDeleteProduct(product.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="coupons" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Create New Coupon</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Coupon Code</label>
                    <Input
                      value={newCoupon.code}
                      onChange={(e) => setNewCoupon(prev => ({...prev, code: e.target.value.toUpperCase()}))}
                      placeholder="SAVE20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Discount Type</label>
                    <Select
                      value={newCoupon.type}
                      onValueChange={(value) => setNewCoupon(prev => ({...prev, type: value as 'percentage' | 'flat'}))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">Percentage Off</SelectItem>
                        <SelectItem value="flat">Flat Amount Off</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Discount Value {newCoupon.type === 'percentage' ? '(%)' : '(₹)'}
                    </label>
                    <Input
                      type="number"
                      value={newCoupon.value}
                      onChange={(e) => setNewCoupon(prev => ({...prev, value: e.target.value}))}
                      placeholder={newCoupon.type === 'percentage' ? '20' : '500'}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Max Usages</label>
                    <Input
                      type="number"
                      value={newCoupon.maxUsages}
                      onChange={(e) => setNewCoupon(prev => ({...prev, maxUsages: e.target.value}))}
                      placeholder="100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Expiry Date</label>
                  <Input
                    type="date"
                    value={newCoupon.expiryDate}
                    onChange={(e) => setNewCoupon(prev => ({...prev, expiryDate: e.target.value}))}
                  />
                </div>

                <Button onClick={handleCreateCoupon} className="w-full">
                  Create Coupon
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Payment QR Code</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Upload Payment QR Code</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleQRUpload}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-black file:text-white hover:file:bg-gray-800"
                  />
                </div>
                
                {checkoutQR && (
                  <div>
                    <p className="text-sm font-medium mb-2">Current QR Code:</p>
                    <img src={checkoutQR} alt="Payment QR Code" className="w-48 h-48 border rounded" />
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Store Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Store Name</label>
                    <Input defaultValue="Fifty-Five" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Contact Email</label>
                    <Input defaultValue="admin@fiftyfive.com" type="email" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Support Phone</label>
                    <Input defaultValue="+91 9876543210" />
                  </div>
                  <Button>Save Settings</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
