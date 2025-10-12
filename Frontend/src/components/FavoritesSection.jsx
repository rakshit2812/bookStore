import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import BookCard from "./BookCard";
import { useTheme } from "../contexts/ThemeContext";

export default function FavoritesSection() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get("https://bookstore-gvbx.onrender.com/favorite", {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setFavorites(response.data.books || []);
    } catch (error) {
      console.error("Error fetching favorites:", error);
      toast.error("Failed to load favorites");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-pink-500"></div>
      </div>
    );
  }

  if (favorites.length === 0) {
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
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
        <h3 className={`text-2xl font-bold mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
          No favorites yet
        </h3>
        <p className={`mb-6 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
          Start adding books to your wishlist by clicking the heart icon!
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className={`text-3xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
          My Favorites
        </h2>
        <span className={`px-4 py-2 rounded-full ${
          theme === "dark" ? "bg-slate-800 text-white" : "bg-gray-200 text-gray-900"
        }`}>
          {favorites.length} {favorites.length === 1 ? "book" : "books"}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {favorites.map((book) => (
          <BookCard key={book._id} book={book} onFavoriteToggle={fetchFavorites} />
        ))}
      </div>
    </div>
  );
}
