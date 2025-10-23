import React, { useState, useEffect } from "react";
import { Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import DashboardOverview from "../components/admin/DashboardOverview";
import AdminAnalytics from "../components/admin/AdminAnalytics";
import ManageBooks from "../components/admin/ManageBooks";
import ManageUsers from "../components/admin/ManageUsers";
import ManageOrders from "../components/admin/ManageOrders";
import Settings from "../components/admin/Settings";
import { useTheme } from "../contexts/ThemeContext";
import { getUserData, clearUserData } from "../utils/auth";
import { BASE_URL } from "../lib/base-url";
import toast from "react-hot-toast";
import axios from "axios";

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();

  useEffect(() => {
    const checkAuth = () => {
      setIsLoading(true);
      const userData = getUserData();
      
      if (!userData) {
        navigate("/login");
        return;
      }

      setUser(userData);
      
      if (userData.role !== "admin") {
        navigate("/");
        return;
      }
      
      setIsLoading(false);
    };

    checkAuth();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      // Call backend to clear the HttpOnly cookie
      // withCredentials is now set globally, cookies sent automatically
      await axios.post(`${BASE_URL}/user/logout`, {});
      
      // Clear user data from sessionStorage
      clearUserData();
      
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      // Even if backend call fails, clear local data
      clearUserData();
      toast.success("Logged out successfully");
      navigate("/login");
    }
  };

  const menuItems = [
    {
      path: "/admin/dashboard",
      label: "Dashboard",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      path: "/admin/analytics",
      label: "Analytics",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      path: "/admin/books",
      label: "Manage Books",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
    },
    {
      path: "/admin/users",
      label: "Manage Users",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
    },
    {
      path: "/admin/orders",
      label: "Manage Orders",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      path: "/admin/settings",
      label: "Settings",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
  ];

  return (
    <div className={theme === "dark" ? "bg-slate-950 min-h-screen" : "bg-gray-50 min-h-screen"}>
      {/* Fixed Sidebar - Full Height */}
      <aside className={`fixed left-0 top-0 h-screen z-40 transition-all duration-300 ease-in-out ${
        isCollapsed ? "w-20" : "w-[320px]"
      } ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      }`}>
        <div className={`h-full shadow-2xl overflow-y-auto overflow-x-hidden ${
          theme === "dark" ? "bg-slate-900" : "bg-white"
        }`}>
          {/* Desktop Collapse Button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`hidden lg:flex absolute top-6 -right-3 z-10 w-6 h-6 rounded-full items-center justify-center shadow-lg transition-all duration-300 ${
              theme === "dark" ? "bg-slate-800 text-white hover:bg-slate-700" : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            <svg
              className={`w-4 h-4 transition-transform duration-300 ${
                isCollapsed ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          {/* Sidebar Content */}
          <div className="relative">
            {/* Admin Info */}
            <div className={`p-6 border-b transition-all duration-300 ${
              theme === "dark" ? "border-slate-800" : "border-gray-200"
            } ${isCollapsed ? "hidden" : ""}`}>
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-orange-500 to-red-600 flex items-center justify-center text-white text-2xl font-bold">
                  <img src={user?.avatar} alt="Profile" className="w-full h-full rounded-full" />
                </div>
                <p className={`mt-2 font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                  {user?.fullname || "Admin"}
                </p>
                <span className="px-3 py-1 bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300 rounded-full text-xs font-semibold">
                  Administrator
                </span>
                <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                  {user?.email || "admin@bookstore.com"}
                </p>
              </div>
            </div>

            {/* Collapsed Avatar */}
            <div className={`p-4 border-b transition-all duration-300 ${
              theme === "dark" ? "border-slate-800" : "border-gray-200"
            } ${isCollapsed ? "flex" : "hidden"} justify-center`}>
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-red-600 flex items-center justify-center text-white text-sm font-bold" title={user?.fullname || "Admin"}>
                <img src={user?.avatar} alt="Profile" className="w-full h-full rounded-full" />
              </div>
            </div>

            {/* Menu Items */}
            <nav className="p-4 pb-20">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 rounded-lg mb-2 transition-all group relative ${
                    isCollapsed ? "justify-center px-2" : "px-4"
                  } py-3 ${
                      location.pathname === item.path
                        ? "bg-gradient-to-r from-orange-500 to-red-600 text-white"
                        : theme === "dark"
                        ? "text-gray-300 hover:bg-slate-800"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                    title={isCollapsed ? item.label : ""}
                  >
                  <div className="flex-shrink-0">{item.icon}</div>
                  <span className={`font-semibold whitespace-nowrap transition-all duration-300 overflow-hidden ${
                    isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
                  }`}>
                    {item.label}
                  </span>
                  {/* Tooltip for collapsed state */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                      {item.label}
                    </div>
                  )}
                </Link>
              ))}

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className={`w-full flex items-center gap-3 rounded-lg mt-4 transition-all group relative ${
                  isCollapsed ? "justify-center px-2" : "px-4"
                } py-3 ${
                    theme === "dark"
                      ? "text-red-400 hover:bg-slate-800"
                      : "text-red-600 hover:bg-red-50"
                  }`}
                  title={isCollapsed ? "Logout" : ""}
                >
                <div className="flex-shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </div>
                <span className={`font-semibold whitespace-nowrap transition-all duration-300 overflow-hidden ${
                  isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
                }`}>
                  Logout
                </span>
                {/* Tooltip for collapsed state */}
                {isCollapsed && (
                  <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                    Logout
                  </div>
                )}
              </button>
            </nav>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Menu Toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className={`lg:hidden fixed top-4 left-4 z-50 p-3 rounded-lg shadow-lg ${
          theme === "dark" ? "bg-slate-900 text-white" : "bg-white text-gray-900"
        }`}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {sidebarOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Main Content */}
      <div className={`transition-all duration-300 ease-in-out ${
        isCollapsed ? "lg:ml-20" : "lg:ml-[280px]"
      }`}>
        <div className="max-w-screen-2xl mx-auto px-4 md:px-20 py-12">
          <div className="mt-12">
            <Routes>
              <Route path="/dashboard" element={<DashboardOverview theme={theme} />} />
              <Route path="/analytics" element={<AdminAnalytics theme={theme} />} />
              <Route path="/books" element={<ManageBooks theme={theme} />} />
              <Route path="/users" element={<ManageUsers theme={theme} />} />
              <Route path="/orders" element={<ManageOrders theme={theme} />} />
              <Route path="/settings" element={<Settings theme={theme} />} />
            </Routes>
          </div>
          
          <Footer />
        </div>
      </div>
    </div>
  );
}
