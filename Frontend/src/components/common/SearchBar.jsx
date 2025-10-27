import React from "react";
import { X, Search } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";

export default function SearchBar({ 
  value, 
  onChange, 
  placeholder = "Search for books, authors, or titles...",
  onClear,
  className = ""
}) {
  const { theme } = useTheme();

  const handleClear = () => {
    if (onClear) {
      onClear();
    }
  };

  return (
    <div className={`relative ${className}`}>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full px-5 py-3 pr-24 rounded-lg border-2 focus:outline-none focus:ring-0 ${
          theme === "dark"
            ? "bg-slate-800 border-slate-700 text-white placeholder-gray-500"
            : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
        }`}
      />
      
      {/* Clear Button */}
      {value && (
        <button
          type="button"
          onClick={handleClear}
          className={`absolute right-14 top-1/2 -translate-y-1/2 p-1.5 rounded-full transition-all hover:bg-gray-200 dark:hover:bg-slate-700 ${
            theme === "dark" ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-900"
          }`}
          title="Clear search"
        >
          <X className="w-5 h-5" />
        </button>
      )}
      
      {/* Search Icon */}
      <Search
        className={`absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 pointer-events-none ${
          theme === "dark" ? "text-gray-500" : "text-gray-400"
        }`}
      />
    </div>
  );
}
