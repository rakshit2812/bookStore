import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useTheme } from "../contexts/ThemeContext";
import { useCart } from "../contexts/CartContext";
import { useConfirmation } from "../contexts/ConfirmationContext";
import { BASE_URL } from "../lib/base-url";

export default function CartPage() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { refreshCart } = useCart();
  const { showConfirmation } = useConfirmation();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await axios.get(`${BASE_URL}/cart`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setCart(response.data);
    } catch (error) {
      console.error("Error fetching cart:", error);
      toast.error("Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (bookId, newQuantity) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.put(
        `${BASE_URL}/cart/update`,
        { bookId, quantity: newQuantity },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      setCart(response.data);
      refreshCart(); // Update cart count in navbar
      toast.success("Cart updated");
    } catch (error) {
      console.error("Error updating cart:", error);
      toast.error("Failed to update cart");
    }
  };

  const handleRemoveItem = async (bookId) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.delete(
        `${BASE_URL}/cart/remove/${bookId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      setCart(response.data);
      refreshCart(); // Update cart count in navbar
      toast.success("Item removed from cart");
    } catch (error) {
      console.error("Error removing item:", error);
      toast.error("Failed to remove item");
    }
  };

  const handleClearCart = async () => {
    const token = localStorage.getItem("token");
    
    const confirmed = await showConfirmation({
      title: 'Clear Cart',
      message: 'Are you sure you want to clear your cart? This action cannot be undone.',
      confirmText: 'Clear Cart',
      cancelText: 'Cancel',
      type: 'warning',
    });

    if (!confirmed) return;

    try {
      const response = await axios.delete(`${BASE_URL}/cart/clear`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setCart(response.data);
      refreshCart(); // Update cart count in navbar
      toast.success("Cart cleared");
    } catch (error) {
      console.error("Error clearing cart:", error);
      toast.error("Failed to clear cart");
    }
  };

  if (loading) {
    return (
      <div className={theme === "dark" ? "bg-slate-950 min-h-screen" : "bg-gray-50 min-h-screen"}>
        <Navbar />
        <div className="flex justify-center items-center py-40">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-pink-500"></div>
        </div>
        <Footer />
      </div>
    );
  }

  const isEmpty = !cart || cart.items.length === 0;
  const subtotal = cart?.totalAmount || 0;
  const shippingCharge = subtotal > 500 ? 0 : 50;
  const tax = subtotal * 0.12;
  const total = subtotal + shippingCharge + tax;

  return (
    <div className={theme === "dark" ? "bg-slate-950 min-h-screen" : "bg-gray-50 min-h-screen"}>
      <Navbar />

      <div className="max-w-screen-2xl container mx-auto px-4 md:px-20 py-12 mt-12">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className={`text-4xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
            Shopping Cart
          </h1>
          {!isEmpty && (
            <button
              onClick={handleClearCart}
              className="px-4 py-2 text-red-600 hover:text-red-700 font-semibold"
            >
              Clear Cart
            </button>
          )}
        </div>

        {isEmpty ? (
          /* Empty Cart */
          <div className={`text-center py-20 rounded-2xl ${
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
            <h2 className={`text-2xl font-bold mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
              Your cart is empty
            </h2>
            <p className={`mb-6 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
              Start adding some books to your cart!
            </p>
            <Link
              to="/books"
              className="inline-block px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition-all"
            >
              Browse Books
            </Link>
          </div>
        ) : (
          /* Cart with Items */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.items.map((item) => (
                <div
                  key={item._id}
                  className={`rounded-xl shadow-lg p-6 ${
                    theme === "dark" ? "bg-slate-900" : "bg-white"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row gap-6">
                    {/* Book Image */}
                    <Link to={`/book/${item.book._id}`} className="flex-shrink-0">
                      <div className="w-32 h-44 rounded-lg overflow-hidden bg-gradient-to-br from-purple-100 to-pink-100">
                        <img
                          src={item.book.image || "/book1.png"}
                          alt={item.book.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </Link>

                    {/* Book Details */}
                    <div className="flex-1">
                      <Link to={`/book/${item.book._id}`}>
                        <h3 className={`text-xl font-bold mb-2 hover:text-pink-500 transition-colors ${
                          theme === "dark" ? "text-white" : "text-gray-900"
                        }`}>
                          {item.book.name || item.book.title}
                        </h3>
                      </Link>
                      <p className={`mb-2 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                        by {item.book.author || "Unknown Author"}
                      </p>
                      <p className="text-2xl font-bold text-pink-500 mb-4">
                        ₹{item.price}
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleUpdateQuantity(item.book._id, item.quantity - 1)}
                            className="w-8 h-8 rounded-full bg-gray-300 hover:bg-gray-400 transition-all font-bold"
                          >
                            -
                          </button>
                          <span className={`text-xl font-bold w-8 text-center ${
                            theme === "dark" ? "text-white" : "text-gray-900"
                          }`}>
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleUpdateQuantity(item.book._id, item.quantity + 1)}
                            disabled={item.quantity >= item.book.stock}
                            className="w-8 h-8 rounded-full bg-gray-300 hover:bg-gray-400 transition-all font-bold disabled:opacity-50"
                          >
                            +
                          </button>
                        </div>

                        <button
                          onClick={() => handleRemoveItem(item.book._id)}
                          className="text-red-600 hover:text-red-700 font-semibold"
                        >
                          Remove
                        </button>
                      </div>

                      {/* Item Total */}
                      <p className={`mt-4 text-lg ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                        Item Total: <span className="font-bold">₹{item.price * item.quantity}</span>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className={`rounded-xl shadow-lg p-6 sticky top-24 ${
                theme === "dark" ? "bg-slate-900" : "bg-white"
              }`}>
                <h2 className={`text-2xl font-bold mb-6 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                  Order Summary
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>
                      Subtotal
                    </span>
                    <span className={theme === "dark" ? "text-white" : "text-gray-900"}>
                      ₹{subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>
                      Shipping
                    </span>
                    <span className={`${
                      shippingCharge === 0 ? "text-green-600" : theme === "dark" ? "text-white" : "text-gray-900"
                    }`}>
                      {shippingCharge === 0 ? "FREE" : `₹${shippingCharge}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>
                      Tax (12% GST)
                    </span>
                    <span className={theme === "dark" ? "text-white" : "text-gray-900"}>
                      ₹{tax.toFixed(2)}
                    </span>
                  </div>
                  <div className="border-t pt-4 flex justify-between">
                    <span className={`text-xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                      Total
                    </span>
                    <span className="text-2xl font-bold text-pink-500">
                      ₹{total.toFixed(2)}
                    </span>
                  </div>
                </div>

                {subtotal < 500 && (
                  <p className="text-sm text-yellow-600 mb-4">
                    Add ₹{(500 - subtotal).toFixed(2)} more for FREE shipping!
                  </p>
                )}

                <Link
                  to="/checkout"
                  className="block w-full px-6 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-center text-lg font-semibold rounded-lg hover:from-pink-600 hover:to-purple-700 transform hover:scale-[1.02] transition-all"
                >
                  Proceed to Checkout
                </Link>

                <Link
                  to="/books"
                  className={`block w-full mt-4 px-6 py-3 text-center rounded-lg font-semibold border-2 transition-all ${
                    theme === "dark"
                      ? "border-slate-700 text-white hover:bg-slate-800"
                      : "border-gray-300 text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
