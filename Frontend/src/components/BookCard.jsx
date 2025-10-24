import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { Heart, Star } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { useCart } from "../contexts/CartContext";
import { getUserData } from "../utils/auth";
import { toggleFavorite } from "../services/favoriteService";
import { addToCart } from "../services/cartService";
import { removeFromCart } from "../services/cartService";
import { updateCartItem } from "../services/cartService";
import { clearCart } from "../services/cartService";

export default function BookCard({ book, onFavoriteToggle }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { theme } = useTheme();
  const { refreshCart, getBookQuantityInCart } = useCart();
  
  // Get quantity from cart context (updates automatically when cart changes)
  const quantity = getBookQuantityInCart(book._id);

  // Get category styling
  const getCategoryStyle = (category) => {
    const categoryLower = category?.toLowerCase() || '';
    
    if (categoryLower.includes('fiction') && !categoryLower.includes('non')) {
      return {
        bg: '#EEF2FF',
        text: '#4F46E5',
        border: '#C7D2FE'
      };
    } else if (categoryLower.includes('romance')) {
      return {
        bg: '#FFE4E9',
        text: '#9F1239',
        border: '#FBCFE8'
      };
    } else if (categoryLower.includes('mystery') || categoryLower.includes('thriller')) {
      return {
        bg: '#FFEDD5',
        text: '#F97316',
        border: '#FED7AA'
      };
    } else if (categoryLower.includes('sci-fi') || categoryLower.includes('science')) {
      return {
        bg: '#E0F2FE',
        text: '#0EA5E9',
        border: '#BAE6FD'
      };
    } else if (categoryLower.includes('non-fiction')) {
      return {
        bg: '#FEF3C7',
        text: '#F59E0B',
        border: '#FDE68A'
      };
    } else if (categoryLower.includes('biography')) {
      return {
        bg: '#D1FAE5',
        text: '#065F46',
        border: '#A7F3D0'
      };
    } else {
      return {
        bg: '#F1F5F9',
        text: '#475569',
        border: '#CBD5E1'
      };
    }
  };

  const categoryStyle = getCategoryStyle(book.category);

  const handleAddToCart = async () => {
    const user = getUserData();
    if (!user) {
      toast.error("Please login to add items to cart");
      return;
    }

    setIsAddingToCart(true);
    try {
      // Cookie sent automatically
      await addToCart(book._id, 1);
      refreshCart(); // Update cart count and items in context
      toast.success("Added to cart!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error(error.response?.data?.message || "Failed to add to cart");
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleIncreaseQuantity = async () => {
    try {
      // Cookie sent automatically
      await updateCartItem(book._id, quantity + 1);
      refreshCart(); // Update cart count and items in context
    } catch (error) {
      console.error("Error updating cart:", error);
      toast.error("Failed to update cart");
    }
  };

  const handleDecreaseQuantity = async () => {
    if (quantity === 1) {
      try {
        // Cookie sent automatically
        await removeFromCart(book._id);
        refreshCart(); // Update cart count and items in context
        toast.success("Removed from cart");
      } catch (error) {
        console.error("Error removing from cart:", error);
        toast.error("Failed to remove from cart");
      }
    } else {
      try {
        // Cookie sent automatically
        await updateCartItem(book._id, quantity - 1);
        refreshCart(); // Update cart count and items in context
      } catch (error) {
        console.error("Error updating cart:", error);
        toast.error("Failed to update cart");
      }
    }
  };

  const handleToggleFavorite = async () => {
    const user = getUserData();
    if (!user) {
      toast.error("Please login to add favorites");
      return;
    }

    try {
      // Cookie sent automatically
      await toggleFavorite(book._id);
      setIsFavorite(!isFavorite);
      toast.success(isFavorite ? "Removed from favorites" : "Added to favorites");
      if (onFavoriteToggle) onFavoriteToggle();
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast.error("Failed to update favorites");
    }
  };

  return (
    <div
      className={`group relative rounded-xl overflow-hidden transition-all duration-300 ${
        theme === "dark" 
          ? "bg-slate-800 border border-slate-700 hover:border-[#B794F6]" 
          : "bg-white border border-[#E2E8F0] hover:border-[#B794F6]"
      }`}
      style={{
        boxShadow: theme === "dark" 
          ? "0 2px 8px rgba(0, 0, 0, 0.3)" 
          : "0 2px 8px rgba(15, 23, 42, 0.06)",
        transform: "translateY(0)"
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = theme === "dark" 
          ? "0 8px 24px rgba(0, 0, 0, 0.4)" 
          : "0 8px 24px rgba(107, 70, 193, 0.12)";
        e.currentTarget.style.transform = "translateY(-4px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = theme === "dark" 
          ? "0 2px 8px rgba(0, 0, 0, 0.3)" 
          : "0 2px 8px rgba(15, 23, 42, 0.06)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {/* Discount Badge */}
      {book.originalPrice && book.originalPrice > book.price && (
        <div 
          className="absolute top-3 left-3 z-10 px-3 py-1 rounded-full text-white text-xs font-semibold"
          style={{
            background: "linear-gradient(135deg, #F59E0B, #FBBF24)",
            fontWeight: "600"
          }}
        >
          {Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100)}% OFF
        </div>
      )}

      {/* Wishlist Heart Icon */}
      <button
        onClick={handleToggleFavorite}
        className={`absolute top-3 right-3 z-10 p-2 rounded-full transition-all ${
          isFavorite 
            ? "bg-[#FFE4E9] text-[#E91E8C]" 
            : "bg-white bg-opacity-90 text-[#64748B] hover:text-[#E91E8C]"
        }`}
      >
        <Heart 
          className={`w-5 h-5 transition-transform hover:scale-110 ${
            isFavorite ? "fill-current" : ""
          }`}
        />
      </button>

      {/* Book Image */}
      <Link to={`/book/${book._id}`} className="block">
        <div 
          className="aspect-[3/4] overflow-hidden relative"
          style={{ borderRadius: "8px 8px 0 0" }}
        >
          <img
            src={book.image || "/book1.png"}
            alt={book.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {/* Overlay on Hover */}
          <div 
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ background: "rgba(107, 70, 193, 0.1)" }}
          ></div>
        </div>
      </Link>

      {/* Book Details */}
      <div className="p-4">
        {/* Category Tag */}
        {book.category && (
          <div className="mb-2">
            <span
              className="text-xs px-2 py-1 rounded-full border"
              style={{
                backgroundColor: categoryStyle.bg,
                color: categoryStyle.text,
                borderColor: categoryStyle.border
              }}
            >
              {book.category}
            </span>
          </div>
        )}

        {/* Book Title */}
        <Link to={`/book/${book._id}`}>
          <h3
            className={`font-semibold text-lg mb-1 line-clamp-2 transition-colors ${
              theme === "dark" ? "text-white hover:text-[#6B46C1]" : "text-[#0F172A] hover:text-[#6B46C1]"
            }`}
            style={{ fontWeight: "600" }}
          >
            {book.name || book.title}
          </h3>
        </Link>

        {/* Author Name */}
        <p
          className={`mb-2 ${
            theme === "dark" ? "text-gray-400" : "text-[#64748B]"
          }`}
          style={{ fontSize: "0.9rem" }}
        >
          by {book.author || "Unknown Author"}
        </p>

        {/* Rating */}
        {book.rating > 0 && (
          <div className="flex items-center mb-3">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(book.rating) 
                      ? "text-[#FBBF24] fill-current" 
                      : "text-[#E2E8F0] fill-current"
                  }`}
                />
              ))}
            </div>
            <span
              className={`ml-2 text-sm ${
                theme === "dark" ? "text-gray-400" : "text-[#64748B]"
              }`}
            >
              {book.rating.toFixed(1)} ({book.reviews || 0})
            </span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {book.originalPrice && book.originalPrice > book.price && (
              <span 
                className="text-sm line-through"
                style={{ color: "#94A3B8" }}
              >
                ₹{book.originalPrice}
              </span>
            )}
            <span 
              className="font-bold"
              style={{ 
                color: "#E91E8C",
                fontWeight: "700",
                fontSize: "1.25rem"
              }}
            >
              ₹{book.price}
            </span>
          </div>
        </div>

        {/* Add to Cart / Quantity Buttons */}
        {quantity === 0 ? (
          <button
            onClick={handleAddToCart}
            disabled={isAddingToCart}
            className="w-full text-white py-2 rounded-lg font-semibold transition-all disabled:opacity-50"
            style={{
              background: "linear-gradient(135deg, #14B8A6, #0D9488)",
              fontWeight: "600",
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(13, 148, 136, 0.3)"
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "linear-gradient(135deg, #0D9488, #065F46)";
              e.target.style.boxShadow = "0 4px 12px rgba(13, 148, 136, 0.4)";
              e.target.style.transform = "scale(1.02)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "linear-gradient(135deg, #14B8A6, #0D9488)";
              e.target.style.boxShadow = "0 2px 8px rgba(13, 148, 136, 0.3)";
              e.target.style.transform = "scale(1)";
            }}
          >
            {isAddingToCart ? "Adding..." : "Add to Cart"}
          </button>
        ) : (
          <div className="flex items-center justify-center gap-3 w-full">
            <button
              onClick={handleDecreaseQuantity}
              className="w-10 h-10 rounded-full text-white font-bold transition-all"
              style={{
                background: "linear-gradient(135deg, #14B8A6, #0D9488)"
              }}
            >
              -
            </button>
            <span
              className={`text-xl font-bold ${
                theme === "dark" ? "text-white" : "text-[#0F172A]"
              }`}
            >
              {quantity}
            </span>
            <button
              onClick={handleIncreaseQuantity}
              className="w-10 h-10 rounded-full text-white font-bold transition-all"
              style={{
                background: "linear-gradient(135deg, #14B8A6, #0D9488)"
              }}
            >
              +
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
