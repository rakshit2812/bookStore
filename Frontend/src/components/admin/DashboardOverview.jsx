import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { getAnalytics } from "../../services/adminService";
import DashboardCardSkeleton from "../skeletons/DashboardCardSkeleton";


export default function DashboardOverview({ theme }) {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      // Cookie sent automatically
      const response = await getAnalytics();
      setAnalytics(response);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      toast.error("Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        {/* Header Skeleton */}
        <div>
          <div className={`h-10 w-64 rounded mb-2 ${
            theme === "dark" ? "bg-slate-800" : "bg-gray-200"
          } animate-pulse`}></div>
          <div className={`h-6 w-96 rounded ${
            theme === "dark" ? "bg-slate-800" : "bg-gray-200"
          } animate-pulse`}></div>
        </div>

        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(6)].map((_, index) => (
            <DashboardCardSkeleton key={index} />
          ))}
        </div>

        {/* Summary Insights Skeleton */}
        <div>
          <div className={`h-8 w-48 rounded mb-4 ${
            theme === "dark" ? "bg-slate-800" : "bg-gray-200"
          } animate-pulse`}></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, index) => (
              <div key={index} className={`rounded-xl shadow-lg p-6 ${
                theme === "dark" ? "bg-slate-900" : "bg-white"
              } animate-pulse`}>
                <div className={`h-6 rounded mb-4 ${
                  theme === "dark" ? "bg-slate-800" : "bg-gray-200"
                } w-40`}></div>
                <div className="space-y-3">
                  <div className={`h-6 rounded ${
                    theme === "dark" ? "bg-slate-800" : "bg-gray-200"
                  } w-full`}></div>
                  <div className={`h-4 rounded ${
                    theme === "dark" ? "bg-slate-800" : "bg-gray-200"
                  } w-3/4`}></div>
                  <div className={`h-4 rounded ${
                    theme === "dark" ? "bg-slate-800" : "bg-gray-200"
                  } w-1/2`}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const getTrendIcon = (trend) => {
    if (trend > 0) {
      return (
        <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      );
    } else if (trend < 0) {
      return (
        <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      );
    }
    return null;
  };

  const stats = [
    {
      label: "Total Users",
      value: analytics?.totalUsers || 0,
      trend: analytics?.usersTrend || 0,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke={`${theme === "dark" ? "#7a00c2" : "#E91E8C"}`} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      color: "",
    },
    {
      label: "Total Books",
      value: analytics?.totalBooks || 0,
      trend: analytics?.booksTrend || 0,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke={`${theme === "dark" ? "#7a00c2" : "#E91E8C"}`} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      color: "",
    },
    {
      label: "Total Revenue",
      value: `₹${analytics?.totalRevenueAllTime?.toFixed(2) || 0}`,
      trend: analytics?.revenueTrend || 0,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke={`${theme === "dark" ? "#7a00c2" : "#E91E8C"}`} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: "",
    },
    {
      label: "Monthly Revenue",
      value: `₹${analytics?.monthlyRevenue?.toFixed(2) || 0}`,
      trend: analytics?.revenueTrend || 0,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke={`${theme === "dark" ? "#7a00c2" : "#E91E8C"}`} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      color: "",
    },
    {
      label: "Average Order Value",
      value: `₹${analytics?.avgOrderValue?.toFixed(2) || 0}`,
      trend: analytics?.aovTrend || 0,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke={`${theme === "dark" ? "#7a00c2" : "#E91E8C"}`} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      color: "",
    },
    {
      label: "Active Users This Month",
      value: analytics?.activeUsersThisMonth || 0,
      trend: analytics?.activeUsersTrend || 0,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke={`${theme === "dark" ? "#7a00c2" : "#E91E8C"}`} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      color: "",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className={`text-4xl font-bold mb-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
          Dashboard Overview
        </h1>
        <p className={`text-lg ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
          Welcome back! Here's what's happening with your bookstore today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`rounded-xl shadow-lg p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
              theme === "dark" ? "bg-slate-900" : "bg-white"
            }`}
          >
            <p className={`text-sm font-medium mb-1 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
              {stat.label}
            </p>

            <div className="flex items-center justify-between mb-4">
              
              <p className={`text-3xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
              {stat.value}
            </p>
            <div className={`p-1 rounded-lg bg-gradient-to-r ${stat.color}`}>
                <div className="text-white">{stat.icon}</div>
              </div>
              
            </div>
            {stat.trend !== null && (
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${
                  stat.trend > 0 ? "bg-green-100 dark:bg-green-900/30" : 
                  stat.trend < 0 ? "bg-red-100 dark:bg-red-900/30" : 
                  ""
                }`}>
                  {getTrendIcon(stat.trend)}
                  <span className={`text-xs font-semibold ${
                    stat.trend > 0 ? "text-green-600 dark:text-green-400" : 
                    stat.trend < 0 ? "text-red-600 dark:text-red-400" : 
                    "text-gray-600 dark:text-gray-400"
                  }`}>
                    {Math.abs(stat.trend).toFixed(1)}%
                  </span>
                </div>
              )}
          </div>
        ))}
      </div>

      {/* Summary Insights */}
      <div>
        <h2 className={`text-2xl font-bold mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
          Summary Insights
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Most Sold Book */}
          <div className={`rounded-xl shadow-lg p-6 ${theme === "dark" ? "bg-slate-900" : "bg-white"}`}>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-gradient-to-r from-yellow-500 to-yellow-600">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className={`text-lg font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                Most Sold Book This Month
              </h3>
            </div>
            {analytics?.mostSoldBook ? (
              <div className="space-y-2">
                <p className={`text-xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                  {analytics.mostSoldBook.name}
                </p>
                <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                  by {analytics.mostSoldBook.author}
                </p>
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div>
                    <p className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>Quantity Sold</p>
                    <p className={`text-2xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                      {analytics.mostSoldBook.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>Revenue</p>
                    <p className={`text-2xl font-bold text-green-500`}>
                      ₹{analytics.mostSoldBook.revenue.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>
                No sales data available for this month.
              </p>
            )}
          </div>

          {/* Top Customers */}
          <div className={`rounded-xl shadow-lg p-6 ${theme === "dark" ? "bg-slate-900" : "bg-white"}`}>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className={`text-lg font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                Top 3 Customers
              </h3>
            </div>
            {analytics?.topCustomers && analytics.topCustomers.length > 0 ? (
              <div className="space-y-3">
                {analytics.topCustomers.map((customer, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg ${
                      theme === "dark" ? "bg-slate-800" : "bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <p className={`font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                        {customer.name}
                      </p>
                      <span className="text-xs font-bold px-2 py-1 rounded-full bg-gradient-to-r from-orange-500 to-red-600 text-white">
                        #{index + 1}
                      </span>
                    </div>
                    <p className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-600"} mb-2`}>
                      {customer.email}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                        {customer.orderCount} orders
                      </span>
                      <span className="text-sm font-bold text-green-500">
                        ₹{customer.totalSpent.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>
                No customer data available for this month.
              </p>
            )}
          </div>

          {/* Average Books Per Order */}
          <div className={`rounded-xl shadow-lg p-6 ${theme === "dark" ? "bg-slate-900" : "bg-white"}`}>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-gradient-to-r from-cyan-500 to-cyan-600">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className={`text-lg font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                Avg. Books Per Order
              </h3>
            </div>
            <div className="text-center py-8">
              <p className={`text-6xl font-bold bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent`}>
                {analytics?.avgBooksPerOrder?.toFixed(1) || 0}
              </p>
              <p className={`mt-4 text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                books per order on average
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
