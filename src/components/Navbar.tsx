
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useStore } from '@/store/useStore';
import { User, ShoppingBag } from 'lucide-react';

const Navbar = () => {
  const { user, cart, setCartOpen, setUser } = useStore();
  const navigate = useNavigate();

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  const handleLogout = () => {
    setUser(null);
    navigate('/');
  };

  return (
    <nav className="bg-black text-white sticky top-0 z-50 border-b border-gray-800 transition-all duration-300 ease-in-out">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link 
            to="/" 
            className="text-2xl font-bold tracking-wider hover:text-gray-300 transition-all duration-300 transform hover:scale-105"
          >
            FIFTY-FIVE
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-8">
            <Link 
              to="/products/Cargos" 
              className="hover:text-gray-300 transition-all duration-300 font-medium relative group"
            >
              CARGOS
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link 
              to="/products/Jackets" 
              className="hover:text-gray-300 transition-all duration-300 font-medium relative group"
            >
              JACKETS
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link 
              to="/products/T-Shirts" 
              className="hover:text-gray-300 transition-all duration-300 font-medium relative group"
            >
              T-SHIRTS
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Cart Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCartOpen(true)}
              className="relative text-white hover:text-gray-300 hover:bg-gray-800 transition-all duration-300 transform hover:scale-110"
            >
              <ShoppingBag className="h-5 w-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-white text-black text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                  {cartItemCount}
                </span>
              )}
            </Button>

            {/* User Menu */}
            {user ? (
              <div className="flex items-center space-x-2">
                <Link to="/account">
                  <Button variant="ghost" size="icon" className="text-white hover:text-gray-300 hover:bg-gray-800 transition-all duration-300 transform hover:scale-110">
                    <User className="h-5 w-5" />
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="text-white hover:text-gray-300 hover:bg-gray-800 transition-all duration-300 transform hover:scale-105"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login">
                  <Button variant="ghost" className="text-white hover:text-gray-300 hover:bg-gray-800 transition-all duration-300 transform hover:scale-105">
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="bg-white text-black hover:bg-gray-200 transition-all duration-300 transform hover:scale-105">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden mt-4 animate-fade-in">
          <div className="flex space-x-6">
            <Link 
              to="/products/Cargos" 
              className="hover:text-gray-300 transition-all duration-300 text-sm font-medium transform hover:scale-105"
            >
              CARGOS
            </Link>
            <Link 
              to="/products/Jackets" 
              className="hover:text-gray-300 transition-all duration-300 text-sm font-medium transform hover:scale-105"
            >
              JACKETS
            </Link>
            <Link 
              to="/products/T-Shirts" 
              className="hover:text-gray-300 transition-all duration-300 text-sm font-medium transform hover:scale-105"
            >
              T-SHIRTS
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
