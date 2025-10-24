import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useTheme } from "../contexts/ThemeContext";
import { useCart } from "../contexts/CartContext";
import { getUserData } from "../utils/auth";
import { addToCart } from "../services/cartService";
import { getBookById } from "../services/bookService";

export default function BookDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const { theme } = useTheme();
  const { refreshCart } = useCart();

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await getBookById(id);
        setBook(response);
      } catch (error) {
        console.error("Error fetching book:", error);
        toast.error("Failed to load book details");
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  const handleAddToCart = async () => {
    const user = getUserData();
    if (!user) {
      toast.error("Please login to add items to cart");
      navigate("/login");
      return;
    }

    try {
      // Cookie sent automatically
      await addToCart(book._id, quantity);
      refreshCart(); // Update cart count in navbar
      toast.success("Added to cart!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error(error.response?.data?.message || "Failed to add to cart");
    }
  };

  const handleToggleFavorite = async () => {
    const user = getUserData();
    if (!user) {
      toast.error("Please login to add favorites");
      navigate("/login");
      return;
    }

    try {
      // Cookie sent automatically
      await toggleFavorite(book._id);
      setIsFavorite(!isFavorite);
      toast.success(isFavorite ? "Removed from favorites" : "Added to favorites");
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast.error("Failed to update favorites");
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

  if (!book) {
    return (
      <div className={theme === "dark" ? "bg-slate-950 min-h-screen" : "bg-gray-50 min-h-screen"}>
        <Navbar />
        <div className="flex flex-col justify-center items-center py-40">
          <h2 className={`text-2xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
            Book not found
          </h2>
          <button
            onClick={() => navigate("/books")}
            className="mt-4 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-semibold"
          >
            Browse Books
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className={theme === "dark" ? "bg-slate-950 min-h-screen" : "bg-gray-50 min-h-screen"}>
      <Navbar />

      <div className="max-w-screen-2xl container mx-auto px-4 md:px-20 py-12">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className={`flex items-center gap-2 mb-8 ${
            theme === "dark" ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Books
        </button>

        {/* Book Details Container */}
        <div className={`rounded-2xl shadow-2xl overflow-hidden ${
          theme === "dark" ? "bg-slate-900" : "bg-white"
        }`}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8 md:p-12">
            {/* Left Side - Image */}
            <div className="flex justify-center items-start">
              <div className="w-full max-w-md">
                <div className="aspect-[3/4] rounded-xl overflow-hidden shadow-2xl bg-gradient-to-br from-purple-100 to-pink-100">
                  <img
                    src={book.image || "/book1.png"}
                    alt={book.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Right Side - Details */}
            <div className="space-y-6">
              {/* Title and Author */}
              <div>
                <h1 className={`text-4xl font-bold mb-2 ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}>
                  {book.name || book.title}
                </h1>
                <p className={`text-xl ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}>
                  by {book.author || "Unknown Author"}
                </p>
              </div>

              {/* Rating */}
              {book.rating > 0 && (
                <div className="flex items-center gap-4">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-6 h-6 ${
                          i < Math.floor(book.rating) ? "fill-current" : "fill-gray-300"
                        }`}
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className={`text-lg ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}>
                    {book.rating.toFixed(1)} ({book.reviews || 0} reviews)
                  </span>
                </div>
              )}

              {/* Genre and Category */}
              <div className="flex gap-3">
                {book.genre && (
                  <span className="px-4 py-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold">
                    {book.genre}
                  </span>
                )}
                {book.category && (
                  <span className={`px-4 py-2 rounded-full ${
                    book.category === "Free"
                      ? "bg-green-100 text-green-700"
                      : "bg-purple-100 text-purple-700"
                  } font-semibold`}>
                    {book.category}
                  </span>
                )}
              </div>

              {/* Description */}
              <div>
                <h3 className={`text-xl font-bold mb-3 ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}>
                  Description
                </h3>
                <p className={`text-lg leading-relaxed ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}>
                  {book.description ? (
                    <>
                      {(() => {
                        const words = book.description.split(' ');
                        const wordCount = words.length;
                        const truncatedText = words.slice(0, 200).join(' ');
                        
                        if (isDescriptionExpanded || wordCount <= 200) {
                          return book.description;
                        } else {
                          return `${truncatedText}...`;
                        }
                      })()}
                      {book.description.split(' ').length > 200 && (
                        <button
                          onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                          className="ml-2 text-pink-500 hover:text-pink-600 font-semibold underline"
                        >
                          {isDescriptionExpanded ? "Read Less" : "Read More"}
                        </button>
                      )}
                    </>
                  ) : (
                    "No description available for this book."
                  )}
                </p>
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-2">
                <span className={`text-lg font-semibold ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}>
                  Availability:
                </span>
                {book.stock > 0 ? (
                  <span className="text-green-600 font-semibold">In Stock ({book.stock} available)</span>
                ) : (
                  <span className="text-red-600 font-semibold">Out of Stock</span>
                )}
              </div>

              {/* Price */}
              <div className="flex items-center gap-4">
                <span className="text-5xl font-bold text-pink-500">₹{book.price}</span>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center gap-4">
                <span className={`text-lg font-semibold ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}>
                  Quantity:
                </span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-full bg-gray-300 hover:bg-gray-400 transition-all font-bold"
                  >
                    -
                  </button>
                  <span className={`text-2xl font-bold w-12 text-center ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}>
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(book.stock, quantity + 1))}
                    disabled={quantity >= book.stock}
                    className="w-10 h-10 rounded-full bg-gray-300 hover:bg-gray-400 transition-all font-bold disabled:opacity-50"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  onClick={handleAddToCart}
                  disabled={book.stock === 0}
                  className="flex-1 px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-lg font-semibold rounded-lg hover:from-pink-600 hover:to-purple-700 transform hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add to Cart
                </button>
                <button
                  onClick={handleToggleFavorite}
                  className={`px-6 py-4 rounded-lg border-2 transition-all ${
                    isFavorite
                      ? "bg-red-500 border-red-500 text-white"
                      : theme === "dark"
                      ? "border-slate-700 text-white hover:bg-slate-800"
                      : "border-gray-300 text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  <svg className="w-6 h-6" fill={isFavorite ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
