import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useTheme } from "../contexts/ThemeContext";
import { BASE_URL } from "../lib/base-url";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [shippingAddress, setShippingAddress] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "India",
    phone: "",
  });
  const { theme } = useTheme();

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
      
      if (!response.data || response.data.items.length === 0) {
        toast.error("Your cart is empty!");
        navigate("/cart");
        return;
      }
      
      setCart(response.data);
    } catch (error) {
      console.error("Error fetching cart:", error);
      toast.error("Failed to load cart");
      navigate("/cart");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!shippingAddress.street.trim()) {
      toast.error("Please enter street address");
      return false;
    }
    if (!shippingAddress.city.trim()) {
      toast.error("Please enter city");
      return false;
    }
    if (!shippingAddress.state.trim()) {
      toast.error("Please enter state");
      return false;
    }
    if (!shippingAddress.zipCode.trim()) {
      toast.error("Please enter zip code");
      return false;
    }
    if (!shippingAddress.phone.trim() || shippingAddress.phone.length < 10) {
      toast.error("Please enter valid phone number");
      return false;
    }
    return true;
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const token = localStorage.getItem("token");
    setProcessing(true);

    try {
      const response = await axios.post(
        `${BASE_URL}/order/create`,
        {
          shippingAddress,
          paymentMethod,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      toast.success("Order placed successfully!");
      
      // Show order confirmation message
      setTimeout(() => {
        navigate("/dashboard/orders");
      }, 2000);
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error(error.response?.data?.message || "Failed to place order");
    } finally {
      setProcessing(false);
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

  const subtotal = cart?.totalAmount || 0;
  const shippingCharge = subtotal > 500 ? 0 : 50;
  const tax = subtotal * 0.18;
  const total = subtotal + shippingCharge + tax;

  return (
    <div className={theme === "dark" ? "bg-slate-950 min-h-screen" : "bg-gray-50 min-h-screen"}>
      <Navbar />

      <div className="max-w-screen-2xl container mx-auto px-4 md:px-20 py-12">
        {/* Header */}
        <h1 className={`text-4xl font-bold mb-8 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
          Checkout
        </h1>

        <form onSubmit={handlePlaceOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Side - Forms */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Address */}
              <div className={`rounded-xl shadow-lg p-6 ${theme === "dark" ? "bg-slate-900" : "bg-white"}`}>
                <h2 className={`text-2xl font-bold mb-6 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                  Shipping Address
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className={`block mb-2 font-semibold ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                      Street Address *
                    </label>
                    <input
                      type="text"
                      name="street"
                      value={shippingAddress.street}
                      onChange={handleInputChange}
                      required
                      placeholder="123 Main Street, Apartment 4B"
                      className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                        theme === "dark"
                          ? "bg-slate-800 border-slate-700 text-white placeholder-gray-500"
                          : "bg-white border-gray-300 text-gray-900"
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`block mb-2 font-semibold ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={shippingAddress.city}
                      onChange={handleInputChange}
                      required
                      placeholder="Mumbai"
                      className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                        theme === "dark"
                          ? "bg-slate-800 border-slate-700 text-white placeholder-gray-500"
                          : "bg-white border-gray-300 text-gray-900"
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`block mb-2 font-semibold ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                      State *
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={shippingAddress.state}
                      onChange={handleInputChange}
                      required
                      placeholder="Maharashtra"
                      className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                        theme === "dark"
                          ? "bg-slate-800 border-slate-700 text-white placeholder-gray-500"
                          : "bg-white border-gray-300 text-gray-900"
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`block mb-2 font-semibold ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                      Zip Code *
                    </label>
                    <input
                      type="text"
                      name="zipCode"
                      value={shippingAddress.zipCode}
                      onChange={handleInputChange}
                      required
                      placeholder="400001"
                      className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                        theme === "dark"
                          ? "bg-slate-800 border-slate-700 text-white placeholder-gray-500"
                          : "bg-white border-gray-300 text-gray-900"
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`block mb-2 font-semibold ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                      Country *
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={shippingAddress.country}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                        theme === "dark"
                          ? "bg-slate-800 border-slate-700 text-white"
                          : "bg-white border-gray-300 text-gray-900"
                      }`}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className={`block mb-2 font-semibold ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={shippingAddress.phone}
                      onChange={handleInputChange}
                      required
                      placeholder="9876543210"
                      className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                        theme === "dark"
                          ? "bg-slate-800 border-slate-700 text-white placeholder-gray-500"
                          : "bg-white border-gray-300 text-gray-900"
                      }`}
                    />
                  </div>
                </div>

                <p className={`mt-4 text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                  📦 Standard delivery time: 5-7 business days
                </p>
              </div>

              {/* Payment Method */}
              <div className={`rounded-xl shadow-lg p-6 ${theme === "dark" ? "bg-slate-900" : "bg-white"}`}>
                <h2 className={`text-2xl font-bold mb-6 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                  Payment Method
                </h2>

                <div className="space-y-4">
                  <label className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    paymentMethod === "COD"
                      ? "border-pink-500 bg-pink-50 dark:bg-pink-900/20"
                      : theme === "dark"
                      ? "border-slate-700 hover:border-slate-600"
                      : "border-gray-300 hover:border-gray-400"
                  }`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="COD"
                      checked={paymentMethod === "COD"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-5 h-5 text-pink-500"
                    />
                    <div className="ml-4">
                      <p className={`font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                        Cash on Delivery (COD)
                      </p>
                      <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                        Pay when you receive your order
                      </p>
                    </div>
                  </label>

                  <label className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    paymentMethod === "Online"
                      ? "border-pink-500 bg-pink-50 dark:bg-pink-900/20"
                      : theme === "dark"
                      ? "border-slate-700 hover:border-slate-600"
                      : "border-gray-300 hover:border-gray-400"
                  }`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Online"
                      checked={paymentMethod === "Online"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-5 h-5 text-pink-500"
                    />
                    <div className="ml-4">
                      <p className={`font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                        Online Payment
                      </p>
                      <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                        Pay now with UPI, Card, or Net Banking (Coming Soon)
                      </p>
                    </div>
                  </label>
                </div>

                {paymentMethod === "Online" && (
                  <div className="mt-4 p-4 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                    <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                      ⚠️ Online payment is currently unavailable. Please use Cash on Delivery.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Side - Order Summary */}
            <div className="lg:col-span-1">
              <div className={`rounded-xl shadow-lg p-6 sticky top-24 ${theme === "dark" ? "bg-slate-900" : "bg-white"}`}>
                <h2 className={`text-2xl font-bold mb-6 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                  Order Summary
                </h2>

                {/* Items List */}
                <div className="space-y-4 mb-6 max-h-60 overflow-y-auto">
                  {cart?.items.map((item) => (
                    <div key={item._id} className="flex gap-3">
                      <img
                        src={item.book.image || "/book1.png"}
                        alt={item.book.name}
                        className="w-16 h-20 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className={`font-semibold text-sm ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                          {item.book.name}
                        </p>
                        <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                          Qty: {item.quantity} × ₹{item.price}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pricing */}
                <div className="space-y-3 border-t pt-4">
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
                      Tax (18% GST)
                    </span>
                    <span className={theme === "dark" ? "text-white" : "text-gray-900"}>
                      ₹{tax.toFixed(2)}
                    </span>
                  </div>
                  <div className="border-t pt-3 flex justify-between">
                    <span className={`text-xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                      Total
                    </span>
                    <span className="text-2xl font-bold text-pink-500">
                      ₹{total.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Place Order Button */}
                <button
                  type="submit"
                  disabled={processing || paymentMethod === "Online"}
                  className="w-full mt-6 px-6 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-lg font-semibold rounded-lg hover:from-pink-600 hover:to-purple-700 transform hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {processing ? "Processing..." : "Place Order"}
                </button>

                <p className={`mt-4 text-xs text-center ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                  By placing your order, you agree to our terms and conditions
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  );
}
