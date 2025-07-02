
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useStore } from '@/store/useStore';
import { User, ShoppingBag, Phone, Mail, Instagram } from 'lucide-react';

const Navbar = () => {
  const { user, cart, setCartOpen, setUser } = useStore();
  const navigate = useNavigate();

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  const handleLogout = () => {
    setUser(null);
    navigate('/');
  };

  const handleInstagramClick = () => {
    window.open('https://instagram.com/the.fifty.five', '_blank');
  };

  return (
    <nav className="bg-black text-white sticky top-0 z-50 border-b border-gray-800">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link 
            to="/" 
            className="text-2xl font-bold tracking-wider hover:text-gray-300 transition-colors"
          >
            FIFTY-FIVE
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-8">
            <Link 
              to="/products/Cargos" 
              className="hover:text-gray-300 transition-colors font-medium"
            >
              CARGOS
            </Link>
            <Link 
              to="/products/Jackets" 
              className="hover:text-gray-300 transition-colors font-medium"
            >
              JACKETS
            </Link>
            <Link 
              to="/products/T-Shirts" 
              className="hover:text-gray-300 transition-colors font-medium"
            >
              T-SHIRTS
            </Link>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Contact Info */}
            <div className="hidden lg:flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-1">
                <Phone className="h-4 w-4" />
                <span>8446421463</span>
              </div>
              <div className="flex items-center space-x-1">
                <Mail className="h-4 w-4" />
                <span>fiftyfivestreetwear@gmail.com</span>
              </div>
              <button
                onClick={handleInstagramClick}
                className="flex items-center space-x-1 hover:text-gray-300 transition-colors"
              >
                <Instagram className="h-4 w-4" />
                <span>@the.fifty.five</span>
              </button>
            </div>

            {/* Cart Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCartOpen(true)}
              className="relative text-white hover:text-gray-300 hover:bg-gray-800"
            >
              <ShoppingBag className="h-5 w-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-white text-black text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Button>

            {/* User Menu */}
            {user ? (
              <div className="flex items-center space-x-2">
                <Link to="/account">
                  <Button variant="ghost" size="icon" className="text-white hover:text-gray-300 hover:bg-gray-800">
                    <User className="h-5 w-5" />
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="text-white hover:text-gray-300 hover:bg-gray-800"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login">
                  <Button variant="ghost" className="text-white hover:text-gray-300 hover:bg-gray-800">
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="bg-white text-black hover:bg-gray-200">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden mt-4">
          <div className="flex space-x-6 mb-3">
            <Link 
              to="/products/Cargos" 
              className="hover:text-gray-300 transition-colors text-sm font-medium"
            >
              CARGOS
            </Link>
            <Link 
              to="/products/Jackets" 
              className="hover:text-gray-300 transition-colors text-sm font-medium"
            >
              JACKETS
            </Link>
            <Link 
              to="/products/T-Shirts" 
              className="hover:text-gray-300 transition-colors text-sm font-medium"
            >
              T-SHIRTS
            </Link>
          </div>
          
          {/* Mobile Contact Info */}
          <div className="flex flex-col space-y-1 text-xs text-gray-300">
            <div className="flex items-center space-x-1">
              <Phone className="h-3 w-3" />
              <span>8446421463</span>
            </div>
            <div className="flex items-center space-x-1">
              <Mail className="h-3 w-3" />
              <span>fiftyfivestreetwear@gmail.com</span>
            </div>
            <button
              onClick={handleInstagramClick}
              className="flex items-center space-x-1 hover:text-white transition-colors"
            >
              <Instagram className="h-3 w-3" />
              <span>@the.fifty.five</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
