
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import CartDrawer from './CartDrawer';
import { Toaster } from '@/components/ui/toaster';

const Layout = () => {
  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar />
      <main className="animate-fade-in">
        <Outlet />
      </main>
      <CartDrawer />
      <Toaster />
    </div>
  );
};

export default Layout;
