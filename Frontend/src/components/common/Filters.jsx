import React from "react";
import { X } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";

export default function Filters({
  categories = [],
  genres = [],
  selectedCategory = "all",
  selectedGenre = "all",
  sortBy = "newest",
  onCategoryChange,
  onGenreChange,
  onSortChange,
  onClear,
  showSort = true,
  showResultsCount = false,
  resultsCount = 0,
  totalCount = 0,
  className = ""
}) {
  const { theme } = useTheme();

  const hasActiveFilters = selectedCategory !== "all" || selectedGenre !== "all" || (showSort && sortBy !== "newest");

  const handleClear = () => {
    if (onClear) {
      onClear();
    }
  };

  return (
    <div className={`flex flex-col md:flex-row gap-4 ${className}`}>
      {/* Category Filter */}
      {categories.length > 0 && (
        <select
          value={selectedCategory}
          onChange={onCategoryChange}
          className={`select select-neutral ${
            theme === "dark"
              ? "bg-slate-800 border-slate-700 text-white"
              : "bg-white border-gray-300 text-gray-900"
          }`}
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category === "all" ? "All Categories" : category}
            </option>
          ))}
        </select>
      )}

      {/* Genre Filter */}
      {genres.length > 0 && (
        <select
          value={selectedGenre}
          onChange={onGenreChange}
          className={`select select-neutral ${
            theme === "dark"
              ? "bg-slate-800 border-slate-700 text-white"
              : "bg-white border-gray-300 text-gray-900"
          }`}
        >
          {genres.map((genre) => (
            <option key={genre} value={genre}>
              {genre === "all" ? "All Genres" : genre}
            </option>
          ))}
        </select>
      )}

      {/* Sort Filter */}
      {showSort && (
        <select
          value={sortBy}
          onChange={onSortChange}
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
      )}

      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <button
          type="button"
          onClick={handleClear}
          className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
            theme === "dark"
              ? "bg-slate-800 text-white hover:bg-slate-700 border border-slate-700"
              : "bg-white text-gray-900 hover:bg-gray-100 border border-gray-300"
          }`}
          title="Clear all filters"
        >
          <X className="w-4 h-4" />
          Clear Filters
        </button>
      )}

      {/* Results Count */}
      {showResultsCount && (
        <div className={`flex items-center px-4 py-3 rounded-lg ${
          theme === "dark" ? "bg-slate-800 text-white" : "bg-white text-gray-900"
        }`}>
          <span className="font-semibold">{resultsCount}</span>
          <span className="ml-2 text-gray-500">books found</span>
        </div>
      )}
    </div>
  );
}