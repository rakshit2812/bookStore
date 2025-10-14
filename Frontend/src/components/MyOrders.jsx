import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import OrderDetailsModal from "./OrderDetailsModal";
import { useTheme } from "../contexts/ThemeContext";
import { BASE_URL } from "../lib/base-url";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(`${BASE_URL}/order`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;

    const token = localStorage.getItem("token");
    try {
      await axios.put(
        `${BASE_URL}/order/cancel/${orderId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      toast.success("Order cancelled successfully");
      fetchOrders(); // Refresh orders
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast.error(error.response?.data?.message || "Failed to cancel order");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      case "Processing":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "Shipped":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";
      case "Delivered":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "Cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-pink-500"></div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className={`rounded-xl shadow-lg p-12 text-center ${
        theme === "dark" ? "bg-slate-900" : "bg-white"
      }`}>
        <svg
          className="mx-auto h-24 w-24 text-gray-400 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
          />
        </svg>
        <h3 className={`text-2xl font-bold mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
          No orders yet
        </h3>
        <p className={`mb-6 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
          Start shopping to see your orders here!
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className={`text-3xl font-bold mb-6 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
        My Orders
      </h2>

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order._id}
            className={`rounded-xl shadow-lg p-6 ${theme === "dark" ? "bg-slate-900" : "bg-white"}`}
          >
            <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
              <div>
                <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                  Order ID: <span className="font-mono">{order._id}</span>
                </p>
                <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                  Placed on: {new Date(order.orderDate).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(order.orderStatus)}`}>
                  {order.orderStatus}
                </span>
              </div>
            </div>

            {/* Order Items Preview */}
            <div className="flex gap-4 mb-4 overflow-x-auto pb-2">
              {order.items.slice(0, 3).map((item, index) => (
                <div key={index} className="flex-shrink-0">
                  <img
                    src={item.book?.image || "/book1.png"}
                    alt={item.book?.name}
                    className="w-16 h-20 object-cover rounded"
                  />
                </div>
              ))}
              {order.items.length > 3 && (
                <div className="flex-shrink-0 w-16 h-20 bg-gray-200 dark:bg-slate-800 rounded flex items-center justify-center">
                  <span className={`text-sm font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                    +{order.items.length - 3}
                  </span>
                </div>
              )}
            </div>

            {/* Order Total and Actions */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-t pt-4 dark:border-slate-800">
              <div>
                <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                  Total Amount
                </p>
                <p className="text-2xl font-bold text-pink-500">₹{order.totalAmount.toFixed(2)}</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => handleViewDetails(order)}
                  className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition-all"
                >
                  View Details
                </button>
                {(order.orderStatus === "Pending" || order.orderStatus === "Processing") && (
                  <button
                    onClick={() => handleCancelOrder(order._id)}
                    className="px-6 py-2 border-2 border-red-500 text-red-500 rounded-lg font-semibold hover:bg-red-500 hover:text-white transition-all"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>

            {/* Delivery Info */}
            {order.deliveryDate && (
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  📦 Expected Delivery: {new Date(order.deliveryDate).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Order Details Modal */}
      {showModal && selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => {
            setShowModal(false);
            setSelectedOrder(null);
          }}
          onCancelOrder={handleCancelOrder}
        />
      )}
    </div>
  );
}
