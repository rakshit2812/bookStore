import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import BookCard from "./BookCard";
import { useTheme } from "../contexts/ThemeContext";
import { BASE_URL } from "../lib/base-url";

export default function GridBookSection({ title, endpoint, viewAllLink, colorScheme = "teal" }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/book/${endpoint}`, {
          withCredentials: true,
        });
        // Limit to 6 books
        setBooks(response.data.slice(0, 6));
      } catch (error) {
        console.error("Error fetching books:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [endpoint]);

  // Color scheme mapping
  const colorSchemes = {
    teal: {
      title: "text-teal-700 dark:text-teal-300",
      accent: "bg-gradient-to-r from-teal-500 to-cyan-600",
      button: "bg-gradient-to-r from-teal-600 to-cyan-700 hover:from-teal-700 hover:to-cyan-800",
      border: "border-teal-400",
    },
    purple: {
      title: "text-purple-700 dark:text-purple-300",
      accent: "bg-gradient-to-r from-purple-500 to-indigo-600",
      button: "bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800",
      border: "border-purple-400",
    },
    coral: {
      title: "text-rose-700 dark:text-rose-300",
      accent: "bg-gradient-to-r from-rose-500 to-pink-600",
      button: "bg-gradient-to-r from-rose-600 to-pink-700 hover:from-rose-700 hover:to-pink-800",
      border: "border-rose-400",
    },
  };

  const colors = colorSchemes[colorScheme] || colorSchemes.teal;

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <div className="py-16">
      <div className="max-w-screen-2xl container mx-auto px-4 md:px-20">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
          <div>
            <h2 className={`text-3xl md:text-4xl font-bold ${colors.title}`}>
              {title}
            </h2>
            <div className={`h-1 w-20 ${colors.accent} mt-2 rounded-full`}></div>
            <p className={`mt-3 text-gray-600 dark:text-gray-400`}>
              Discover our newest collection of books
            </p>
          </div>
        </div>

        {/* Books Grid - Max 6 books */}
        {books.length === 0 ? (
          <div className={`text-center py-12 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
            No books found
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {books.map((book) => (
                <BookCard key={book._id} book={book} />
              ))}
            </div>

            {/* View All Button */}
            {viewAllLink && (
              <div className="flex justify-center mt-8">
                <Link
                  to={viewAllLink}
                  className={`px-8 py-4 rounded-xl ${colors.button} text-white font-semibold text-lg shadow-lg transition-all transform hover:scale-105 flex items-center gap-2`}
                >
                  View All Books
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
