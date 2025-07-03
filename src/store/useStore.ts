
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Product {
  id: string;
  name: string;
  category: 'Cargos' | 'Jackets' | 'T-Shirts';
  description: string;
  price: number;
  images: string[];
  sizes: ('S' | 'M' | 'L' | 'XL' | 'XXL')[];
  createdAt: string;
}

export interface CartItem {
  productId: string;
  product: Product;
  size: string;
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  discount: number;
  couponCode?: string;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
    pincode: string;
  };
  paymentProof?: string;
  status: 'Processing' | 'Packed' | 'Out for Delivery' | 'Delivered';
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Coupon {
  id: string;
  code: string;
  type: 'percentage' | 'flat';
  value: number;
  maxUsages: number;
  currentUsages: number;
  expiryDate: string;
  active: boolean;
  createdAt: string;
}

interface StoreState {
  // Auth
  user: User | null;
  isAdmin: boolean;
  
  // Products
  products: Product[];
  
  // Cart
  cart: CartItem[];
  isCartOpen: boolean;
  
  // Orders
  orders: Order[];
  
  // Coupons
  appliedCoupon: Coupon | null;
  coupons: Coupon[];
  
  // QR Code
  checkoutQR: string | null;
  paymentQRImage: string | null;
  
  // Actions
  setUser: (user: User | null) => void;
  setIsAdmin: (isAdmin: boolean) => void;
  setProducts: (products: Product[]) => void;
  addProduct: (product: Product) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string, size: string) => void;
  updateCartQuantity: (productId: string, size: string, quantity: number) => void;
  clearCart: () => void;
  setCartOpen: (open: boolean) => void;
  applyCoupon: (coupon: Coupon) => void;
  removeCoupon: () => void;
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  setCheckoutQR: (qr: string) => void;
  setPaymentQRImage: (image: string) => void;
  addCoupon: (coupon: Coupon) => void;
  updateCoupon: (id: string, coupon: Partial<Coupon>) => void;
  deleteCoupon: (id: string) => void;
  validateCoupon: (code: string) => Coupon | null;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // Initial state - no demo data
      user: null,
      isAdmin: false,
      products: [],
      cart: [],
      isCartOpen: false,
      orders: [],
      appliedCoupon: null,
      coupons: [],
      checkoutQR: null,
      paymentQRImage: null,

      // Actions
      setUser: (user) => set({ user }),
      setIsAdmin: (isAdmin) => set({ isAdmin }),
      setProducts: (products) => set({ products }),
      
      addProduct: (product) => {
        const { products } = get();
        set({ products: [...products, product] });
      },
      
      updateProduct: (id, updatedProduct) => {
        const { products } = get();
        set({
          products: products.map((product) =>
            product.id === id ? { ...product, ...updatedProduct } : product
          ),
        });
      },
      
      deleteProduct: (id) => {
        const { products } = get();
        set({
          products: products.filter((product) => product.id !== id),
        });
      },
      
      addToCart: (item) => {
        const { cart } = get();
        const existingItem = cart.find(
          (cartItem) => cartItem.productId === item.productId && cartItem.size === item.size
        );
        
        if (existingItem) {
          set({
            cart: cart.map((cartItem) =>
              cartItem.productId === item.productId && cartItem.size === item.size
                ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
                : cartItem
            ),
          });
        } else {
          set({ cart: [...cart, item] });
        }
      },
      
      removeFromCart: (productId, size) => {
        const { cart } = get();
        set({
          cart: cart.filter(
            (item) => !(item.productId === productId && item.size === size)
          ),
        });
      },
      
      updateCartQuantity: (productId, size, quantity) => {
        const { cart } = get();
        if (quantity <= 0) {
          get().removeFromCart(productId, size);
          return;
        }
        
        set({
          cart: cart.map((item) =>
            item.productId === productId && item.size === size
              ? { ...item, quantity }
              : item
          ),
        });
      },
      
      clearCart: () => set({ cart: [] }),
      setCartOpen: (open) => set({ isCartOpen: open }),
      
      applyCoupon: (coupon) => set({ appliedCoupon: coupon }),
      removeCoupon: () => set({ appliedCoupon: null }),
      
      addOrder: (order) => {
        const { orders } = get();
        set({ orders: [order, ...orders] });
      },
      
      updateOrderStatus: (orderId, status) => {
        const { orders } = get();
        set({
          orders: orders.map((order) =>
            order.id === orderId ? { ...order, status } : order
          ),
        });
      },
      
      setCheckoutQR: (qr) => set({ checkoutQR: qr }),
      setPaymentQRImage: (image) => set({ paymentQRImage: image }),
      
      addCoupon: (coupon) => {
        const { coupons } = get();
        set({ coupons: [...coupons, coupon] });
      },
      
      updateCoupon: (id, updatedCoupon) => {
        const { coupons } = get();
        set({
          coupons: coupons.map((coupon) =>
            coupon.id === id ? { ...coupon, ...updatedCoupon } : coupon
          ),
        });
      },
      
      deleteCoupon: (id) => {
        const { coupons } = get();
        set({
          coupons: coupons.filter((coupon) => coupon.id !== id),
        });
      },
      
      validateCoupon: (code) => {
        const { coupons } = get();
        const coupon = coupons.find(c => 
          c.code === code && 
          c.active && 
          c.currentUsages < c.maxUsages &&
          new Date(c.expiryDate) > new Date()
        );
        return coupon || null;
      },
    }),
    {
      name: 'fifty-five-store',
      partialize: (state) => ({
        user: state.user,
        cart: state.cart,
        orders: state.orders,
        appliedCoupon: state.appliedCoupon,
        products: state.products,
        coupons: state.coupons,
        checkoutQR: state.checkoutQR,
        paymentQRImage: state.paymentQRImage,
      }),
    }
  )
);
