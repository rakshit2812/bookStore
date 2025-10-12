import React, { useState, useEffect } from "react";
import { Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import MyOrders from "../components/MyOrders";
import FavoritesSection from "../components/FavoritesSection";
import { useTheme } from "../contexts/ThemeContext";

export default function UserDashboard() {
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();

  useEffect(() => {
    // Get user info from localStorage or fetch from API
    const userInfo = localStorage.getItem("user");
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const menuItems = [
    {
      path: "/dashboard/orders",
      label: "My Orders",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
    },
    {
      path: "/dashboard/favorites",
      label: "Favorites",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
    },
    {
      path: "/dashboard/profile",
      label: "Profile",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
  ];

  return (
    <div className={theme === "dark" ? "bg-slate-950 min-h-screen" : "bg-gray-50 min-h-screen"}>
      <Navbar />

      <div className="max-w-screen-2xl container mx-auto px-4 md:px-20 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className={`lg:w-64 flex-shrink-0`}>
            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={`lg:hidden mb-4 px-4 py-2 rounded-lg ${
                theme === "dark" ? "bg-slate-900 text-white" : "bg-white text-gray-900"
              }`}
            >
              {sidebarOpen ? "Close Menu" : "Open Menu"}
            </button>

            {/* Sidebar Content */}
            <div
              className={`${
                sidebarOpen ? "block" : "hidden"
              } lg:block rounded-xl shadow-lg overflow-hidden ${
                theme === "dark" ? "bg-slate-900" : "bg-white"
              }`}
            >
              {/* User Info */}
              <div className={`p-6 border-b ${theme === "dark" ? "border-slate-800" : "border-gray-200"}`}>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                    {user?.fullname?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <div>
                    <p className={`font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                      {user?.fullname || "User"}
                    </p>
                    <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                      {user?.email || "user@email.com"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <nav className="p-4">
                {menuItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-all ${
                      location.pathname === item.path
                        ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white"
                        : theme === "dark"
                        ? "text-gray-300 hover:bg-slate-800"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {item.icon}
                    <span className="font-semibold">{item.label}</span>
                  </Link>
                ))}

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mt-4 transition-all ${
                    theme === "dark"
                      ? "text-red-400 hover:bg-slate-800"
                      : "text-red-600 hover:bg-red-50"
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span className="font-semibold">Logout</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <Routes>
              <Route path="/" element={<DashboardHome user={user} theme={theme} />} />
              <Route path="/orders" element={<MyOrders />} />
              <Route path="/favorites" element={<FavoritesSection />} />
              <Route path="/profile" element={<ProfileSection user={user} theme={theme} />} />
            </Routes>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

// Dashboard Home Component
function DashboardHome({ user, theme }) {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className={`rounded-xl shadow-lg p-8 ${theme === "dark" ? "bg-slate-900" : "bg-white"}`}>
        <h1 className={`text-3xl font-bold mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
          Welcome back, {user?.fullname || "User"}! 👋
        </h1>
        <p className={`text-lg ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
          Manage your orders, favorites, and profile settings from here.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          onClick={() => navigate("/dashboard/orders")}
          className={`rounded-xl shadow-lg p-6 cursor-pointer hover:scale-105 transition-transform ${
            theme === "dark" ? "bg-slate-900" : "bg-white"
          }`}
        >
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h3 className={`text-xl font-bold mb-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
            My Orders
          </h3>
          <p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>
            View and track your orders
          </p>
        </div>

        <div
          onClick={() => navigate("/dashboard/favorites")}
          className={`rounded-xl shadow-lg p-6 cursor-pointer hover:scale-105 transition-transform ${
            theme === "dark" ? "bg-slate-900" : "bg-white"
          }`}
        >
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h3 className={`text-xl font-bold mb-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
            Favorites
          </h3>
          <p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>
            Your wishlist items
          </p>
        </div>

        <div
          onClick={() => navigate("/cart")}
          className={`rounded-xl shadow-lg p-6 cursor-pointer hover:scale-105 transition-transform ${
            theme === "dark" ? "bg-slate-900" : "bg-white"
          }`}
        >
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className={`text-xl font-bold mb-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
            Shopping Cart
          </h3>
          <p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>
            View your cart items
          </p>
        </div>
      </div>
    </div>
  );
}

// Profile Section Component
function ProfileSection({ user, theme }) {
  return (
    <div className={`rounded-xl shadow-lg p-8 ${theme === "dark" ? "bg-slate-900" : "bg-white"}`}>
      <h2 className={`text-2xl font-bold mb-6 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
        Profile Information
      </h2>
      <div className="space-y-4">
        <div>
          <label className={`block mb-2 font-semibold ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
            Full Name
          </label>
          <p className={`text-lg ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
            {user?.fullname || "Not available"}
          </p>
        </div>
        <div>
          <label className={`block mb-2 font-semibold ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
            Email
          </label>
          <p className={`text-lg ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
            {user?.email || "Not available"}
          </p>
        </div>
      </div>
    </div>
  );
}
