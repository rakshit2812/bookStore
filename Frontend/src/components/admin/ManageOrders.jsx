import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { BASE_URL } from "../../lib/base-url";

export default function ManageOrders({ theme }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [filterStatus]);

  const fetchOrders = async () => {
    const token = localStorage.getItem("token");
    try {
      const url = filterStatus === "all" 
        ? `${BASE_URL}/admin/orders` 
        : `${BASE_URL}/admin/orders?status=${filterStatus}`;
      
      const response = await axios.get(url, {
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

  const viewOrderDetails = async (orderId) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(`${BASE_URL}/admin/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setSelectedOrder(response.data);
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching order details:", error);
      toast.error("Failed to load order details");
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    const token = localStorage.getItem("token");
    try {
      await axios.put(
        `${BASE_URL}/admin/orders/${orderId}/status`,
        { orderStatus: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      toast.success("Order status updated successfully");
      fetchOrders();
      if (selectedOrder?._id === orderId) {
        setSelectedOrder({ ...selectedOrder, orderStatus: newStatus });
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Failed to update order status");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "Shipped":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "Processing":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      case "Pending":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300";
      case "Cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-4xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
            Manage Orders
          </h1>
          <p className={`mt-2 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
            View and manage all customer orders
          </p>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className={`flex flex-wrap gap-2 p-4 rounded-xl ${theme === "dark" ? "bg-slate-900" : "bg-white"} shadow-lg`}>
        {["all", "Pending", "Processing", "Shipped", "Delivered", "Cancelled"].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              filterStatus === status
                ? "bg-gradient-to-r from-orange-500 to-red-600 text-white"
                : theme === "dark"
                ? "bg-slate-800 text-gray-300 hover:bg-slate-700"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {status === "all" ? "All Orders" : status}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className={`rounded-xl shadow-lg overflow-hidden ${theme === "dark" ? "bg-slate-900" : "bg-white"}`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={theme === "dark" ? "bg-slate-800" : "bg-gray-50"}>
              <tr>
                <th className={`px-6 py-4 text-left text-sm font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                  Order ID
                </th>
                <th className={`px-6 py-4 text-left text-sm font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                  User
                </th>
                <th className={`px-6 py-4 text-left text-sm font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                  Total Amount
                </th>
                <th className={`px-6 py-4 text-left text-sm font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                  Status
                </th>
                <th className={`px-6 py-4 text-left text-sm font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                  Date
                </th>
                <th className={`px-6 py-4 text-left text-sm font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center">
                    <p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>
                      No orders found
                    </p>
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr
                    key={order._id}
                    className={`${theme === "dark" ? "hover:bg-slate-800" : "hover:bg-gray-50"} transition-colors`}
                  >
                    <td className={`px-6 py-4 text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-900"}`}>
                      #{order._id.slice(-8).toUpperCase()}
                    </td>
                    <td className={`px-6 py-4 text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-900"}`}>
                      <div>
                        <p className="font-semibold">{order.user?.fullname}</p>
                        <p className={`text-xs ${theme === "dark" ? "text-gray-500" : "text-gray-500"}`}>
                          {order.user?.email}
                        </p>
                      </div>
                    </td>
                    <td className={`px-6 py-4 text-sm font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                      ₹{order.totalAmount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.orderStatus)}`}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className={`px-6 py-4 text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => viewOrderDetails(order._id)}
                        className="px-4 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold hover:shadow-lg transition-all"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className={`max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl ${
            theme === "dark" ? "bg-slate-900" : "bg-white"
          }`}>
            {/* Modal Header */}
            <div className={`sticky top-0 z-10 flex items-center justify-between p-6 border-b ${
              theme === "dark" ? "bg-slate-900 border-gray-700" : "bg-white border-gray-200"
            }`}>
              <h2 className={`text-2xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                Order Details
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className={`p-2 rounded-lg ${
                  theme === "dark" ? "hover:bg-slate-800" : "hover:bg-gray-100"
                }`}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Order Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>Order ID</p>
                  <p className={`font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                    #{selectedOrder._id.slice(-8).toUpperCase()}
                  </p>
                </div>
                <div>
                  <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>Order Date</p>
                  <p className={`font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                    {new Date(selectedOrder.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>Customer</p>
                  <p className={`font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                    {selectedOrder.user?.fullname}
                  </p>
                  <p className={`text-xs ${theme === "dark" ? "text-gray-500" : "text-gray-500"}`}>
                    {selectedOrder.user?.email}
                  </p>
                </div>
                <div>
                  <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>Payment Method</p>
                  <p className={`font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                    {selectedOrder.paymentMethod}
                  </p>
                </div>
              </div>

              {/* Order Status Update */}
              <div className={`p-4 rounded-lg ${theme === "dark" ? "bg-slate-800" : "bg-gray-50"}`}>
                <p className={`text-sm font-semibold mb-3 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                  Update Order Status
                </p>
                <div className="flex flex-wrap gap-2">
                  {["Pending", "Processing", "Shipped", "Delivered", "Cancelled"].map((status) => (
                    <button
                      key={status}
                      onClick={() => updateOrderStatus(selectedOrder._id, status)}
                      disabled={selectedOrder.orderStatus === status}
                      className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                        selectedOrder.orderStatus === status
                          ? "bg-gradient-to-r from-orange-500 to-red-600 text-white"
                          : theme === "dark"
                          ? "bg-slate-700 text-gray-300 hover:bg-slate-600"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              {/* Items */}
              <div>
                <h3 className={`text-lg font-bold mb-3 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                  Order Items
                </h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, index) => (
                    <div
                      key={index}
                      className={`flex items-center gap-4 p-4 rounded-lg ${
                        theme === "dark" ? "bg-slate-800" : "bg-gray-50"
                      }`}
                    >
                      <img
                        src={item.book?.image}
                        alt={item.book?.name}
                        className="w-16 h-20 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className={`font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                          {item.book?.name}
                        </p>
                        <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                          by {item.book?.author}
                        </p>
                        <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                          Quantity: {item.quantity} × ₹{item.price}
                        </p>
                      </div>
                      <p className={`font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                        ₹{(item.quantity * item.price).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Address */}
              <div>
                <h3 className={`text-lg font-bold mb-3 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                  Delivery Address
                </h3>
                <div className={`p-4 rounded-lg ${theme === "dark" ? "bg-slate-800" : "bg-gray-50"}`}>
                  <p className={theme === "dark" ? "text-gray-300" : "text-gray-700"}>
                    {selectedOrder.shippingAddress.street}
                  </p>
                  <p className={theme === "dark" ? "text-gray-300" : "text-gray-700"}>
                    {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zipCode}
                  </p>
                  <p className={theme === "dark" ? "text-gray-300" : "text-gray-700"}>
                    {selectedOrder.shippingAddress.country}
                  </p>
                  <p className={`mt-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                    Phone: {selectedOrder.shippingAddress.phone}
                  </p>
                </div>
              </div>

              {/* Order Summary */}
              <div className={`p-4 rounded-lg ${theme === "dark" ? "bg-slate-800" : "bg-gray-50"}`}>
                <h3 className={`text-lg font-bold mb-3 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                  Order Summary
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>Subtotal</span>
                    <span className={theme === "dark" ? "text-white" : "text-gray-900"}>₹{selectedOrder.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>Shipping</span>
                    <span className={theme === "dark" ? "text-white" : "text-gray-900"}>₹{selectedOrder.shippingCharge.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>Tax</span>
                    <span className={theme === "dark" ? "text-white" : "text-gray-900"}>₹{selectedOrder.tax.toFixed(2)}</span>
                  </div>
                  <div className={`flex justify-between pt-2 border-t ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`}>
                    <span className={`text-lg font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Total</span>
                    <span className="text-lg font-bold text-green-500">₹{selectedOrder.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
