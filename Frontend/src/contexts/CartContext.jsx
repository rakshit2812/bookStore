import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../lib/base-url";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState([]);

  const fetchCartData = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setCartCount(0);
      setCartItems([]);
      return;
    }

    try {
      const response = await axios.get(`${BASE_URL}/cart`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setCartCount(response.data.items?.length || 0);
      setCartItems(response.data.items || []);
    } catch (error) {
      console.error("Error fetching cart data:", error);
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
