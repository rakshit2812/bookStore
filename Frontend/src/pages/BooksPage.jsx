import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BookCard from "../components/BookCard";
import { useTheme } from "../contexts/ThemeContext";
import { BookOpen, Star } from "lucide-react";
import { BASE_URL } from "../lib/base-url";

export default function BooksPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState(searchParams.get("genre") || "all");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "all");
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "newest");
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [debouncedSearch, setDebouncedSearch] = useState(searchParams.get("search") || "");
  const [genres, setGenres] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { theme } = useTheme();

  // Debouncing search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 1500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch genres and categories
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/book/genres`, {
          withCredentials: true,
        });
        setGenres(["all", ...response.data]);
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    };
    
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/book/categories`, {
          withCredentials: true,
        });
        setCategories(["all", ...response.data]);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    
    fetchGenres();
    fetchCategories();
  }, []);

  // Fetch books
  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (debouncedSearch) params.append("search", debouncedSearch);
        if (selectedGenre !== "all") params.append("genre", selectedGenre);
        if (selectedCategory !== "all") params.append("category", selectedCategory);
        if (sortBy) params.append("sortBy", sortBy);
        params.append("page", currentPage);

        const response = await axios.get(
          `${BASE_URL}/book/filter?${params.toString()}`,
          { withCredentials: true }
        );

        setBooks(response.data.books || []);
        setTotalPages(response.data.totalPages || 1);
      } catch (error) {
        console.error("Error fetching books:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [debouncedSearch, selectedGenre, selectedCategory, sortBy, currentPage]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleGenreChange = (e) => {
    setSelectedGenre(e.target.value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(1);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className={theme === "dark" ? "bg-slate-950 min-h-screen" : "bg-gray-50 min-h-screen"}>
      <Navbar />
      
      {/* Hero Section */}
      <div 
        className={`relative overflow-hidden ${
          theme === "dark" 
            ? "bg-slate-900" 
            : "bg-gradient-to-br from-[#F8FAFC] via-[#F0FDFA] to-[#E9D8FD]"
        }`}
        style={{
          background: theme === "light" 
            ? "linear-gradient(135deg, #F8FAFC 0%, #F0FDFA 50%, #E9D8FD 100%)"
            : undefined
        }}
      >
        <div className="max-w-screen-2xl container mx-auto px-4 md:px-20 py-12 md:py-16">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            {/* Left Content */}
            <div className="w-full lg:w-1/2 space-y-8 mt-16 lg:mt-24">

              {/* Main Heading */}
              <h1 
                className={`text-4xl md:text-6xl font-extrabold leading-tight ${
                  theme === "dark" ? "text-white" : "text-[#0F172A]"
                }`}
                style={{
                  textShadow: theme === "light" ? "0 2px 4px rgba(15, 23, 42, 0.04)" : "none"
                }}
              >
                Your Gateway to{" "}
                <span 
                  className="bg-gradient-to-br from-[#E91E8C] to-[#B794F6] bg-clip-text text-transparent"
                  style={{
                    background: "linear-gradient(135deg, #E91E8C 0%, #B794F6 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent"
                  }}
                >
                  Infinite Stories
                </span>
              </h1>
              
              {/* Description */}
              <p 
                className={`text-lg md:text-xl ${
                  theme === "dark" ? "text-gray-300" : "text-[#475569]"
                }`}
                style={{ lineHeight: "1.8" }}
              >
                Dive into our curated collection of over 10,000 books spanning every genre imaginable. From timeless classics to latest releases, award-winning novels to hidden literary gems.
              </p>

              {/* Stats Row */}
              <div className={`flex items-center justify-between p-6 rounded-2xl ${
                theme === "dark" ? "bg-slate-800/50" : "bg-white"
              } backdrop-blur-sm border ${
                theme === "dark" ? "border-slate-700" : "border-[#E2E8F0]"
              } shadow-lg`}>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <span 
                      className="text-3xl md:text-4xl font-bold bg-gradient-to-br from-[#E91E8C] to-[#6B46C1] bg-clip-text text-transparent"
                      style={{
                        background: "linear-gradient(135deg, #E91E8C, #6B46C1)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        fontWeight: "800"
                      }}
                    >
                      10K
                    </span>
                    <span className="text-[#14B8A6] text-2xl font-bold">+</span>
                  </div>
                  <div 
                    className={`text-sm mt-1 ${
                      theme === "dark" ? "text-gray-400" : "text-[#64748B]"
                    }`}
                    style={{ fontWeight: "500", letterSpacing: "0.5px" }}
                  >
                    Books
                  </div>
                </div>

                <div 
                  className={`w-px h-12 ${
                    theme === "dark" ? "bg-slate-600" : "bg-[#E2E8F0]"
                  }`}
                ></div>

                <div className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <span 
                      className="text-3xl md:text-4xl font-bold bg-gradient-to-br from-[#E91E8C] to-[#6B46C1] bg-clip-text text-transparent"
                      style={{
                        background: "linear-gradient(135deg, #E91E8C, #6B46C1)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        fontWeight: "800"
                      }}
                    >
                      50
                    </span>
                    <span className="text-[#14B8A6] text-2xl font-bold">+</span>
                  </div>
                  <div 
                    className={`text-sm mt-1 ${
                      theme === "dark" ? "text-gray-400" : "text-[#64748B]"
                    }`}
                    style={{ fontWeight: "500", letterSpacing: "0.5px" }}
                  >
                    Genres
                  </div>
                </div>

                <div 
                  className={`w-px h-12 ${
                    theme === "dark" ? "bg-slate-600" : "bg-[#E2E8F0]"
                  }`}
                ></div>

                <div className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <span 
                      className="text-3xl md:text-4xl font-bold bg-gradient-to-br from-[#E91E8C] to-[#6B46C1] bg-clip-text text-transparent"
                      style={{
                        background: "linear-gradient(135deg, #E91E8C, #6B46C1)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        fontWeight: "800"
                      }}
                    >
                      100
                    </span>
                    <span className="text-[#14B8A6] text-2xl font-bold">+</span>
                  </div>
                  <div 
                    className={`text-sm mt-1 ${
                      theme === "dark" ? "text-gray-400" : "text-[#64748B]"
                    }`}
                    style={{ fontWeight: "500", letterSpacing: "0.5px" }}
                  >
                    Authors
                  </div>
                </div>
              </div>
            </div>

            {/* Right - Book Image */}
            <div className="w-full lg:w-1/2 relative">
              <div className="relative z-10">
                <img
                  src="/book-banner.png"
                  alt="Book Collection"
                  className="w-full max-w-lg mx-auto drop-shadow-2xl transform hover:scale-105 transition-transform duration-300"
                />
              </div>
              
              {/* Floating Elements */}
              <div className={`absolute top-10 left-10 p-4 rounded-2xl shadow-xl ${
                theme === "dark" ? "bg-slate-800" : "bg-white"
              } backdrop-blur-sm border ${
                theme === "dark" ? "border-slate-700" : "border-[#E2E8F0]"
              } animate-bounce`}>
                <BookOpen className="w-8 h-8 text-[#E91E8C]" />
              </div>

              <div className={`absolute bottom-20 right-10 p-3 rounded-xl shadow-xl ${
                theme === "dark" ? "bg-slate-800" : "bg-white"
              } backdrop-blur-sm border ${
                theme === "dark" ? "border-slate-700" : "border-[#E2E8F0]"
              } animate-pulse`}>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-[#FBBF24] fill-current" />
                  <span className={`text-sm font-bold ${
                    theme === "dark" ? "text-white" : "text-[#0F172A]"
                  }`}>
                    4.8
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-screen-2xl container mx-auto px-4 md:px-20 py-8">
        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search for books, authors, or titles..."
              className={`w-full px-6 py-4 rounded-lg border-2 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all ${
                theme === "dark"
                  ? "bg-slate-800 border-slate-700 text-white placeholder-gray-500"
                  : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
              }`}
            />
            <svg
              className="absolute right-4 top-4 w-6 h-6 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {/* Filters Row */}
          <div className="flex flex-col md:flex-row gap-4">
            {/* Category Filter */}
            <select
              defaultValue={selectedCategory}
              onChange={handleCategoryChange}
              className={`select select-neutral ${
                theme === "dark"
                  ? "bg-slate-800 border-slate-700 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
            >
              {categories && categories.length > 0 && categories.map((category) => (
                <option key={category} value={category}>
                  {category === "all" ? "All Categories" : category}
                </option>
              ))}
            </select>

            {/* Genre Filter */}
            <select
              defaultValue={selectedGenre}
              onChange={handleGenreChange}
              className={`select select-neutral ${
                theme === "dark"
                  ? "bg-slate-800 border-slate-700 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
            >
              {genres && genres.length > 0 && genres.map((genre) => (
                <option key={genre} value={genre}>
                  {genre === "all" ? "All Genres" : genre}
                </option>
              ))}
            </select>

            {/* Sort Filter */}
            <select
              defaultValue={sortBy}
              onChange={handleSortChange}
              className={`select select-neutral ${
                theme === "dark"
                  ? "bg-slate-800 border-slate-700 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
            >
              <option value="newest">Newest First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>

            {/* Results Count */}
            <div className={`flex items-center px-4 py-3 rounded-lg ${
              theme === "dark" ? "bg-slate-800 text-white" : "bg-white text-gray-900"
            }`}>
              <span className="font-semibold">{books.length}</span>
              <span className="ml-2 text-gray-500">books found</span>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-pink-500"></div>
          </div>
        ) : books.length === 0 ? (
          /* No Results */
          <div className="text-center py-20">
            <svg
              className="mx-auto h-24 w-24 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className={`mt-4 text-xl font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
              No books found
            </h3>
            <p className={`mt-2 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          /* Books Grid */
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {books.map((book) => (
                <BookCard key={book._id} book={book} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    currentPage === 1
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700"
                  }`}
                >
                  Previous
                </button>

                <div className="flex gap-2">
                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index + 1}
                      onClick={() => setCurrentPage(index + 1)}
                      className={`w-10 h-10 rounded-lg font-semibold transition-all ${
                        currentPage === index + 1
                          ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white"
                          : theme === "dark"
                          ? "bg-slate-800 text-white hover:bg-slate-700"
                          : "bg-white text-gray-900 hover:bg-gray-100"
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    currentPage === totalPages
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700"
                  }`}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}
