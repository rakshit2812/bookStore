import React from "react";

export default function OrderDetailsModal({ order, onClose, onCancelOrder }) {
  const theme = localStorage.getItem("theme");

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

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "Paid":
        return "text-green-600";
      case "Pending":
        return "text-yellow-600";
      case "Failed":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        className={`max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl ${
          theme === "dark" ? "bg-slate-900" : "bg-white"
        }`}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex justify-between items-center p-6 border-b bg-gradient-to-r from-pink-500 to-purple-600">
          <h2 className="text-2xl font-bold text-white">Order Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-all"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Order Info */}
          <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
              <div>
                <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                  Order ID
                </p>
                <p className={`font-mono text-lg ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                  {order._id}
                </p>
              </div>
              <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(order.orderStatus)}`}>
                {order.orderStatus}
              </span>
            </div>
            <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
              Order Date: {new Date(order.orderDate).toLocaleString()}
            </p>
          </div>

          {/* Shipping Information */}
          <div className={`p-6 rounded-xl ${theme === "dark" ? "bg-slate-800" : "bg-gray-50"}`}>
            <h3 className={`text-xl font-bold mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
              📦 Shipping Information
            </h3>
            <div className="space-y-2">
              <p className={theme === "dark" ? "text-gray-300" : "text-gray-700"}>
                {order.shippingAddress.street}
              </p>
              <p className={theme === "dark" ? "text-gray-300" : "text-gray-700"}>
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
              </p>
              <p className={theme === "dark" ? "text-gray-300" : "text-gray-700"}>
                {order.shippingAddress.country}
              </p>
              <p className={theme === "dark" ? "text-gray-300" : "text-gray-700"}>
                Phone: {order.shippingAddress.phone}
              </p>
              {order.deliveryDate && (
                <p className={`mt-4 font-semibold ${theme === "dark" ? "text-blue-400" : "text-blue-600"}`}>
                  Expected Delivery: {new Date(order.deliveryDate).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>

          {/* Payment Information */}
          <div className={`p-6 rounded-xl ${theme === "dark" ? "bg-slate-800" : "bg-gray-50"}`}>
            <h3 className={`text-xl font-bold mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
              💳 Payment Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                  Payment Method
                </p>
                <p className={`font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                  {order.paymentMethod}
                </p>
              </div>
              <div>
                <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                  Payment Status
                </p>
                <p className={`font-semibold ${getPaymentStatusColor(order.paymentStatus)}`}>
                  {order.paymentStatus}
                </p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h3 className={`text-xl font-bold mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
              📚 Order Items
            </h3>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className={`flex gap-4 p-4 rounded-xl ${theme === "dark" ? "bg-slate-800" : "bg-gray-50"}`}
                >
                  <img
                    src={item.book?.image || "/book1.png"}
                    alt={item.book?.name}
                    className="w-20 h-28 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h4 className={`font-bold mb-1 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                      {item.book?.name || item.book?.title}
                    </h4>
                    <p className={`text-sm mb-2 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                      by {item.book?.author || "Unknown"}
                    </p>
                    <div className="flex justify-between items-center">
                      <p className={theme === "dark" ? "text-gray-300" : "text-gray-700"}>
                        Quantity: <span className="font-semibold">{item.quantity}</span>
                      </p>
                      <p className="font-bold text-pink-500">
                        ₹{item.price} × {item.quantity} = ₹{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className={`p-6 rounded-xl ${theme === "dark" ? "bg-slate-800" : "bg-gray-50"}`}>
            <h3 className={`text-xl font-bold mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
              💰 Order Summary
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>Subtotal</span>
                <span className={theme === "dark" ? "text-white" : "text-gray-900"}>
                  ₹{order.subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>Shipping Charge</span>
                <span className={`${
                  order.shippingCharge === 0 ? "text-green-600" : theme === "dark" ? "text-white" : "text-gray-900"
                }`}>
                  {order.shippingCharge === 0 ? "FREE" : `₹${order.shippingCharge.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>Tax (18% GST)</span>
                <span className={theme === "dark" ? "text-white" : "text-gray-900"}>
                  ₹{order.tax.toFixed(2)}
                </span>
              </div>
              <div className="border-t pt-3 flex justify-between items-center">
                <span className={`text-xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                  Total Amount
                </span>
                <span className="text-2xl font-bold text-pink-500">
                  ₹{order.totalAmount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Order Status Timeline */}
          <div className={`p-6 rounded-xl ${theme === "dark" ? "bg-slate-800" : "bg-gray-50"}`}>
            <h3 className={`text-xl font-bold mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
              📊 Order Status
            </h3>
            <div className="flex items-center justify-between relative">
              {["Pending", "Processing", "Shipped", "Delivered"].map((status, index) => {
                const isActive = ["Pending", "Processing", "Shipped", "Delivered"].indexOf(order.orderStatus) >= index;
                const isCancelled = order.orderStatus === "Cancelled";
                
                return (
                  <div key={status} className="flex flex-col items-center relative z-10">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                        isCancelled
                          ? "bg-red-500 text-white"
                          : isActive
                          ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white"
                          : "bg-gray-300 text-gray-600"
                      }`}
                    >
                      {isActive || isCancelled ? "✓" : index + 1}
                    </div>
                    <p
                      className={`mt-2 text-xs font-semibold ${
                        isActive || isCancelled
                          ? theme === "dark"
                            ? "text-white"
                            : "text-gray-900"
                          : theme === "dark"
                          ? "text-gray-500"
                          : "text-gray-400"
                      }`}
                    >
                      {status}
                    </p>
                  </div>
                );
              })}
              <div className="absolute top-5 left-0 right-0 h-1 bg-gray-300 -z-10"></div>
            </div>
            {order.orderStatus === "Cancelled" && (
              <p className="mt-4 text-center text-red-600 font-semibold">Order has been cancelled</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            {(order.orderStatus === "Pending" || order.orderStatus === "Processing") && (
              <button
                onClick={() => {
                  onCancelOrder(order._id);
                  onClose();
                }}
                className="flex-1 px-6 py-3 border-2 border-red-500 text-red-500 rounded-lg font-semibold hover:bg-red-500 hover:text-white transition-all"
              >
                Cancel Order
              </button>
            )}
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition-all"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
