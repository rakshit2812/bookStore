import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../lib/base-url";
import { getUserData } from "../utils/auth";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState([]);

  const fetchCartData = async () => {
    console.log("🛒 CartContext: Fetching cart data...");
    const user = getUserData();
    
    if (!user) {
      console.log("❌ CartContext: No user data found in sessionStorage");
      setCartCount(0);
      setCartItems([]);
      return;
    }

    console.log("✅ CartContext: User found, making request to:", `${BASE_URL}/cart`);
    
    try {
      // withCredentials is now set globally, cookies sent automatically
      const response = await axios.get(`${BASE_URL}/cart`);
      console.log("✅ CartContext: Cart data received:", response.data);
      setCartCount(response.data.items?.length || 0);
      setCartItems(response.data.items || []);
    } catch (error) {
      console.error("❌ CartContext: Error fetching cart data:", error);
      console.error("Error details:", error.response?.status, error.response?.data);
      setCartCount(0);
      setCartItems([]);
    }
  };

  const updateCartCount = (count) => {
    setCartCount(count);
  };

  const refreshCart = () => {
    fetchCartData();
  };

  const getBookQuantityInCart = (bookId) => {
    const cartItem = cartItems.find((item) => item.book._id === bookId);
    return cartItem ? cartItem.quantity : 0;
  };

  useEffect(() => {
    fetchCartData();
  }, []);

  return (
    <CartContext.Provider value={{ cartCount, cartItems, updateCartCount, refreshCart, getBookQuantityInCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
