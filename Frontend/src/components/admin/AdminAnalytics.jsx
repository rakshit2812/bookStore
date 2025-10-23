import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { BASE_URL } from "../../lib/base-url";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

export default function AdminAnalytics({ theme }) {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [revenueView, setRevenueView] = useState("monthly"); // "monthly" or "daily"
  const [userView, setUserView] = useState("monthly"); // "monthly" or "daily"
  const [orderStatusView, setOrderStatusView] = useState("monthly"); // "monthly" or "daily"

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      // Cookie sent automatically
      const response = await axios.get(`${BASE_URL}/admin/analytics`);
      setAnalytics(response.data);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      toast.error("Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-500"></div>
      </div>
    );
  }

  // Format data for monthly revenue chart (last 12 months)
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthlyRevenueData = analytics?.monthlyRevenueTrends?.map(item => ({
    month: `${monthNames[item._id.month - 1]} ${item._id.year}`,
    revenue: item.revenue,
    orders: item.count
  })) || [];

  // Format data for daily revenue chart (current month)
  const dailyRevenueData = analytics?.dailyRevenueCurrentMonth?.map(item => ({
    date: new Date(item._id).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    revenue: item.revenue,
    orders: item.count
  })) || [];

  // Format data for monthly users chart (last 12 months)
  const monthlyUserData = analytics?.monthlyUserTrends?.map(item => ({
    month: `${monthNames[item._id.month - 1]} ${item._id.year}`,
    users: item.count
  })) || [];

  // Format data for daily users chart (current month)
  const dailyUserData = analytics?.dailyUsersCurrentMonth?.map(item => ({
    date: new Date(item._id).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    users: item.count
  })) || [];

  // Select data based on view
  const revenueData = revenueView === "monthly" ? monthlyRevenueData : dailyRevenueData;
  const revenueDataKey = revenueView === "monthly" ? "month" : "date";
  
  const userData = userView === "monthly" ? monthlyUserData : dailyUserData;
  const userDataKey = userView === "monthly" ? "month" : "date";

  // Format order status data for pie chart
  const orderStatusData = orderStatusView === "monthly" 
    ? (analytics?.monthlyOrderStatus?.map(item => ({
        name: item._id,
        value: item.count
      })) || [])
    : (analytics?.dailyOrderStatus?.reduce((acc, item) => {
        const status = item._id.status;
        const existing = acc.find(s => s.name === status);
        if (existing) {
          existing.value += item.count;
        } else {
          acc.push({ name: status, value: item.count });
        }
        return acc;
      }, []) || []);

  const COLORS = {
    'Pending': '#F59E0B',
    'Processing': '#EAB308',
    'Shipped': '#3B82F6',
    'Delivered': '#10B981',
    'Cancelled': '#EF4444'
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className={`text-4xl font-bold mb-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
          Analytics & Trends
        </h1>
        <p className={`text-lg ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
          Visualize your bookstore's performance over time
        </p>
      </div>

      {/* Charts */}
      <div className="space-y-6">
        {/* Revenue Trend */}
        <div className={`rounded-xl shadow-lg p-8 ${theme === "dark" ? "bg-slate-900" : "bg-white"}`}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div>
                <h3 className={`text-2xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                  Revenue Trend
                </h3>
                <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                  {revenueView === "monthly" 
                    ? "Revenue and order volume over the last 12 months" 
                    : "Daily revenue trend for current month"}
                </p>
              </div>
            </div>
            
            {/* Toggle Buttons */}
            <div className={`flex rounded-lg p-1 ${theme === "dark" ? "bg-slate-800" : "bg-gray-100"}`}>
              <button
                onClick={() => setRevenueView("monthly")}
                className={`px-4 py-2 rounded-md text-sm font-semibold transition-all ${
                  revenueView === "monthly"
                    ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-md"
                    : theme === "dark"
                    ? "text-gray-400 hover:text-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setRevenueView("daily")}
                className={`px-4 py-2 rounded-md text-sm font-semibold transition-all ${
                  revenueView === "daily"
                    ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-md"
                    : theme === "dark"
                    ? "text-gray-400 hover:text-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Daily
              </button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme === "dark" ? "#374151" : "#e5e7eb"} />
              <XAxis 
                dataKey={revenueDataKey}
                stroke={theme === "dark" ? "#9CA3AF" : "#6B7280"}
                style={{ fontSize: '13px' }}
              />
              <YAxis 
                yAxisId="left"
                stroke={theme === "dark" ? "#9CA3AF" : "#6B7280"}
                style={{ fontSize: '13px' }}
              />
              {/* <YAxis 
                yAxisId="right"
                orientation="right"
                stroke={theme === "dark" ? "#9CA3AF" : "#6B7280"}
                style={{ fontSize: '13px' }}
              /> */}
              <Tooltip 
                contentStyle={{
                  backgroundColor: theme === "dark" ? "#1F2937" : "#FFFFFF",
                  border: `1px solid ${theme === "dark" ? "#374151" : "#E5E7EB"}`,
                  borderRadius: '8px',
                  color: theme === "dark" ? "#FFFFFF" : "#000000"
                }}
              />
              <Legend />
              <Line 
                yAxisId="left"
                type="linear" 
                dataKey="revenue" 
                stroke="#8B5CF6" 
                strokeWidth={3} 
                name="Revenue (₹)" 
                dot={{ fill: '#8B5CF6', r: 5 }}
                activeDot={{ r: 7 }}
              />
              {/* <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="orders" 
                stroke="#10B981" 
                strokeWidth={3} 
                name="Orders" 
                dot={{ fill: '#10B981', r: 5 }}
                activeDot={{ r: 7 }}
              /> */}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* User Registrations */}
        <div className={`rounded-xl shadow-lg p-8 ${theme === "dark" ? "bg-slate-900" : "bg-white"}`}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <h3 className={`text-2xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                  User Registrations
                </h3>
                <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                  {userView === "monthly" 
                    ? "User registration trends over the last 12 months" 
                    : "Daily user registrations for current month"}
                </p>
              </div>
            </div>

            {/* Toggle Buttons */}
            <div className={`flex rounded-lg p-1 ${theme === "dark" ? "bg-slate-800" : "bg-gray-100"}`}>
              <button
                onClick={() => setUserView("monthly")}
                className={`px-4 py-2 rounded-md text-sm font-semibold transition-all ${
                  userView === "monthly"
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md"
                    : theme === "dark"
                    ? "text-gray-400 hover:text-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setUserView("daily")}
                className={`px-4 py-2 rounded-md text-sm font-semibold transition-all ${
                  userView === "daily"
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md"
                    : theme === "dark"
                    ? "text-gray-400 hover:text-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Daily
              </button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={userData}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme === "dark" ? "#374151" : "#e5e7eb"} />
              <XAxis 
                dataKey={userDataKey}
                stroke={theme === "dark" ? "#9CA3AF" : "#6B7280"}
                style={{ fontSize: '13px' }}
              />
              <YAxis 
                stroke={theme === "dark" ? "#9CA3AF" : "#6B7280"}
                style={{ fontSize: '13px' }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: theme === "dark" ? "#1F2937" : "#FFFFFF",
                  border: `1px solid ${theme === "dark" ? "#374151" : "#E5E7EB"}`,
                  borderRadius: '8px',
                  color: theme === "dark" ? "#FFFFFF" : "#000000"
                }}
              />
              <Legend />
              <Bar 
                dataKey="users" 
                fill="#3B82F6" 
                name="New Users"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Order Status Distribution */}
        <div className={`rounded-xl shadow-lg p-8 ${theme === "dark" ? "bg-slate-900" : "bg-white"}`}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-r from-indigo-500 to-indigo-600">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h3 className={`text-2xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                  Order Status Distribution
                </h3>
                <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                  {orderStatusView === "monthly" 
                    ? "Order status breakdown for current month" 
                    : "Cumulative order status for current month"}
                </p>
              </div>
            </div>

            {/* Toggle Buttons */}
            <div className={`flex rounded-lg p-1 ${theme === "dark" ? "bg-slate-800" : "bg-gray-100"}`}>
              <button
                onClick={() => setOrderStatusView("monthly")}
                className={`px-4 py-2 rounded-md text-sm font-semibold transition-all ${
                  orderStatusView === "monthly"
                    ? "bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-md"
                    : theme === "dark"
                    ? "text-gray-400 hover:text-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setOrderStatusView("daily")}
                className={`px-4 py-2 rounded-md text-sm font-semibold transition-all ${
                  orderStatusView === "daily"
                    ? "bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-md"
                    : theme === "dark"
                    ? "text-gray-400 hover:text-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Daily
              </button>
            </div>
          </div>
          
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={orderStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {orderStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[entry.name] || '#6B7280'} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: theme === "dark" ? "#1F2937" : "#FFFFFF",
                    border: `1px solid ${theme === "dark" ? "#374151" : "#E5E7EB"}`,
                    borderRadius: '8px',
                    color: theme === "dark" ? "#FFFFFF" : "#000000"
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Legend */}
            <div className="flex flex-col gap-3">
              {orderStatusData.map((entry, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: COLORS[entry.name] || '#6B7280' }}
                  />
                  <div>
                    <p className={`font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                      {entry.name}
                    </p>
                    <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                      {entry.value} orders
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`rounded-xl shadow-lg p-6 ${theme === "dark" ? "bg-slate-900" : "bg-white"}`}>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-green-600">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h4 className={`text-lg font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
              Total Orders
            </h4>
          </div>
          <p className={`text-3xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
            {analytics?.totalOrders || 0}
          </p>
        </div>

        <div className={`rounded-xl shadow-lg p-6 ${theme === "dark" ? "bg-slate-900" : "bg-white"}`}>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-gradient-to-r from-yellow-500 to-yellow-600">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h4 className={`text-lg font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
              Total Books
            </h4>
          </div>
          <p className={`text-3xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
            {analytics?.totalBooks || 0}
          </p>
        </div>

        <div className={`rounded-xl shadow-lg p-6 ${theme === "dark" ? "bg-slate-900" : "bg-white"}`}>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h4 className={`text-lg font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
              Total Users
            </h4>
          </div>
          <p className={`text-3xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
            {analytics?.totalUsers || 0}
          </p>
        </div>
      </div>
    </div>
  );
}
