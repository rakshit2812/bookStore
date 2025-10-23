import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import { User, ShoppingCart, Sun, Moon } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { useCart } from "../contexts/CartContext";
import { getUserData } from "../utils/auth";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { cartCount } = useCart();
  const location = useLocation();

  const [sticky, setSticky] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status on mount and location changes
  useEffect(() => {
    const checkAuth = () => {
      const user = getUserData();
      setIsAuthenticated(!!user);
    };
    
    checkAuth();
    // Re-check on location change (e.g., after login/logout)
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setSticky(true);
      } else {
        setSticky(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <div
      className={`w-full bg-white dark:bg-slate-950 fixed top-0 left-0 right-0 z-50 border-b border-gray-200 dark:border-slate-800 ${
        sticky && "shadow-[0_2px_12px_rgba(15,23,42,0.06)]"
      }`}
    >
      <div className="max-w-screen-2xl container mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left - Logo */}
          <Link to="/" className="flex items-center group">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Book<span className="text-[#E91E8C]">Store</span>
            </h1>
          </Link>

          {/* Center - Navigation Links (Hidden on mobile) */}
          <nav className="hidden lg:flex items-center space-x-2">
            <Link
              to="/"
              className={`relative px-4 py-2 rounded-full font-medium transition-all ${
                isActive("/")
                  ? "text-[#E91E8C] font-semibold"
                  : "text-[#334155] dark:text-gray-300 hover:text-[#6B46C1] dark:hover:text-purple-400 hover:bg-[#F0FDFA] dark:hover:bg-slate-800"
              }`}
            >
              Home
              {isActive("/") && (
                <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#E91E8C] rounded-t-full"></span>
              )}
            </Link>
            <Link
              to="/books"
              className={`relative px-4 py-2 rounded-full font-medium transition-all ${
                isActive("/books")
                  ? "text-[#E91E8C] font-semibold"
                  : "text-[#334155] dark:text-gray-300 hover:text-[#6B46C1] dark:hover:text-purple-400 hover:bg-[#F0FDFA] dark:hover:bg-slate-800"
              }`}
            >
              Books
              {isActive("/books") && (
                <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#E91E8C] rounded-t-full"></span>
              )}
            </Link>
            <Link
              to="/contact"
              className={`relative px-4 py-2 rounded-full font-medium transition-all ${
                isActive("/contact")
                  ? "text-[#E91E8C] font-semibold"
                  : "text-[#334155] dark:text-gray-300 hover:text-[#6B46C1] dark:hover:text-purple-400 hover:bg-[#F0FDFA] dark:hover:bg-slate-800"
              }`}
            >
              Contact
              {isActive("/contact") && (
                <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#E91E8C] rounded-t-full"></span>
              )}
            </Link>
          </nav>

          {/* Right - Actions */}
          <div className="flex items-center gap-3">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-[#FEF3C7] dark:hover:bg-slate-800 transition-all group"
              aria-label="Toggle theme"
            >
              {theme === "light" ? (
                <Sun className="w-5 h-5 text-[#F59E0B] group-hover:text-[#FBBF24] transition-colors" />
              ) : (
                <Moon className="w-5 h-5 text-blue-400" />
              )}
            </button>

            {isAuthenticated ? (
              <>
                {/* Cart Icon */}
                <Link
                  to="/cart"
                  className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-all group"
                  aria-label="Shopping cart"
                >
                  <ShoppingCart className="w-5 h-5 text-[#334155] dark:text-gray-300 group-hover:text-[#E91E8C] transition-colors" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[#DC2626] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md">
                      {cartCount}
                    </span>
                  )}
                </Link>

                {/* Profile Icon */}
                <Link
                  to="/dashboard/orders"
                  className="p-2 rounded-full bg-gradient-to-br from-[#6B46C1] to-[#E91E8C] hover:scale-105 transition-all shadow-md hover:shadow-[0_4px_12px_rgba(107,70,193,0.3)]"
                  aria-label="User profile"
                >
                  <User className="w-5 h-5 text-white" />
                </Link>
              </>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#6B46C1] to-[#E91E8C] text-white font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-md"
              >
                Login
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button className="lg:hidden p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
              <svg
                className="w-6 h-6 text-[#334155] dark:text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
