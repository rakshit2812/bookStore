import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

export default function EnhancedBanner() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { theme } = useTheme();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/books?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  return (
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
      {/* Hero Section */}
      <div className="max-w-screen-2xl container mx-auto px-4 sm:px-6 md:px-12 lg:px-20 py-8 sm:py-12 md:py-16 lg:py-24">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 sm:gap-10 lg:gap-12">
          {/* Left Content */}
          <div className="w-full lg:w-1/2 space-y-4 sm:space-y-6 md:space-y-8">
            {/* Main Heading */}
            <h1 
              className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight ${
                theme === "dark" ? "text-white" : "text-[#0F172A]"
              }`}
              style={{
                textShadow: theme === "light" ? "0 2px 4px rgba(15, 23, 42, 0.04)" : "none"
              }}
            >
              Discover Your Next{" "}
              <span 
                className="bg-gradient-to-br from-[#E91E8C] to-[#B794F6] bg-clip-text text-transparent"
                style={{
                  background: "linear-gradient(135deg, #E91E8C 0%, #B794F6 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent"
                }}
              >
                Great Read
              </span>
            </h1>
            
            {/* Description */}
            <p 
              className={`text-sm sm:text-base md:text-lg lg:text-xl ${
                theme === "dark" ? "text-gray-300" : "text-[#475569]"
              }`}
              style={{ lineHeight: "1.6" }}
            >
              Explore thousands of books across all genres. From bestsellers to hidden gems, find your perfect story today.
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="relative">
              <div className="flex items-center rounded-full overflow-hidden bg-white shadow-lg">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search books..."
                    className="w-full px-4 sm:px-6 py-3 sm:py-4 pr-10 sm:pr-12 text-sm sm:text-base outline-none bg-white text-[#1E293B] placeholder-[#94A3B8] border-2 border-[#E2E8F0] rounded-l-full focus:border-[#6B46C1] focus:shadow-[0_0_0_4px_rgba(107,70,193,0.1)] transition-all"
                  />
                  {/* Clear Button */}
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={handleClearSearch}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-gray-100 transition-all"
                      title="Clear search"
                    >
                      <X className="w-5 h-5 text-gray-500 hover:text-gray-700" />
                    </button>
                  )}
                </div>
                <button
                  type="submit"
                  className="px-4 sm:px-6 md:px-8 py-3 sm:py-4 text-sm sm:text-base text-white font-semibold rounded-r-full transition-all shadow-[0_4px_12px_rgba(233,30,140,0.3)] hover:shadow-[0_6px_20px_rgba(233,30,140,0.4)]"
                  style={{
                    background: "linear-gradient(135deg, #E91E8C 0%, #FF6B9D 100%)",
                    fontWeight: "600"
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = "linear-gradient(135deg, #8B2E6F 0%, #E91E8C 100%)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "linear-gradient(135deg, #E91E8C 0%, #FF6B9D 100%)";
                  }}
                >
                  Search
                </button>
              </div>
            </form>

            {/* Statistics Section - Hidden on mobile, compact on tablet */}
            <div className="hidden sm:flex items-center justify-around sm:justify-between pt-4 sm:pt-6 md:pt-8 bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-lg">
              {/* Stat 1 */}
              <div className="text-center">
                <div className="flex items-center justify-center">
                  <span 
                    className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold bg-gradient-to-br from-[#E91E8C] to-[#6B46C1] bg-clip-text text-transparent"
                    style={{
                      background: "linear-gradient(135deg, #E91E8C, #6B46C1)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      fontWeight: "800"
                    }}
                  >
                    10K
                  </span>
                  <span className="text-[#14B8A6] text-xl sm:text-2xl md:text-3xl font-bold ml-1">+</span>
                </div>
                <div 
                  className={`text-xs sm:text-sm mt-1 sm:mt-2 ${
                    theme === "dark" ? "text-gray-400" : "text-[#64748B]"
                  }`}
                  style={{ 
                    fontWeight: "500",
                    letterSpacing: "0.5px"
                  }}
                >
                  Books Collection
                </div>
              </div>

              {/* Divider */}
              <div 
                className="w-px bg-[#E2E8F0] dark:bg-slate-600"
                style={{ height: "60px" }}
              ></div>

              {/* Stat 2 */}
              <div className="text-center">
                <div className="flex items-center justify-center">
                  <span 
                    className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold bg-gradient-to-br from-[#E91E8C] to-[#6B46C1] bg-clip-text text-transparent"
                    style={{
                      background: "linear-gradient(135deg, #E91E8C, #6B46C1)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      fontWeight: "800"
                    }}
                  >
                    50K
                  </span>
                  <span className="text-[#14B8A6] text-xl sm:text-2xl md:text-3xl font-bold ml-1">+</span>
                </div>
                <div 
                  className={`text-xs sm:text-sm mt-1 sm:mt-2 ${
                    theme === "dark" ? "text-gray-400" : "text-[#64748B]"
                  }`}
                  style={{ 
                    fontWeight: "500",
                    letterSpacing: "0.5px"
                  }}
                >
                  Happy Readers
                </div>
              </div>

              {/* Divider */}
              <div 
                className="w-px bg-[#E2E8F0] dark:bg-slate-600"
                style={{ height: "60px" }}
              ></div>

              {/* Stat 3 */}
              <div className="text-center">
                <div className="flex items-center justify-center">
                  <span 
                    className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold bg-gradient-to-br from-[#E91E8C] to-[#6B46C1] bg-clip-text text-transparent"
                    style={{
                      background: "linear-gradient(135deg, #E91E8C, #6B46C1)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      fontWeight: "800"
                    }}
                  >
                    25
                  </span>
                  <span className="text-[#14B8A6] text-xl sm:text-2xl md:text-3xl font-bold ml-1">+</span>
                </div>
                <div 
                  className={`text-xs sm:text-sm mt-1 sm:mt-2 ${
                    theme === "dark" ? "text-gray-400" : "text-[#64748B]"
                  }`}
                  style={{ 
                    fontWeight: "500",
                    letterSpacing: "0.5px"
                  }}
                >
                  Industry Awards
                </div>
              </div>
            </div>
          </div>

          {/* Right - Book Illustration Section */}
          <div className="w-full lg:w-1/2 relative mt-6 lg:mt-0">
            <div 
              className="relative z-10 p-0 sm:p-4 md:p-6 lg:p-8 rounded-xl sm:rounded-2xl lg:rounded-3xl"
              
            >
              <img
                src="/banner.png"
                alt="Books Collection"
                loading="lazy"
                className="w-full rounded-lg sm:rounded-xl lg:rounded-2xl transform hover:scale-105 transition-transform duration-300"
              />
              
              {/* Decorative Elements */}
              {/* Coffee Cup */}
              {/* <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#FFFBEB] border-2 border-[#78350F] opacity-80">
                <div className="w-4 h-4 bg-[#78350F] rounded-full mt-1 ml-1"></div>
              </div> */}
              
              {/* Book Spines */}
              {/* <div className="absolute bottom-4 left-4 flex space-x-1">
                <div className="w-2 h-16 bg-[#4F46E5] rounded-sm"></div>
                <div className="w-2 h-14 bg-[#F97316] rounded-sm"></div>
                <div className="w-2 h-18 bg-[#DC2626] rounded-sm"></div>
                <div className="w-2 h-12 bg-[#1E40AF] rounded-sm"></div>
                <div className="w-2 h-15 bg-[#10B981] rounded-sm"></div>
              </div> */}
              
              {/* Eucalyptus Leaves */}
              {/* <div className="absolute top-8 left-4 w-6 h-12 bg-gradient-to-b from-[#A8D5BA] to-[#10B981] rounded-full opacity-70 transform rotate-12"></div>
              <div className="absolute top-12 left-8 w-4 h-8 bg-gradient-to-b from-[#A8D5BA] to-[#10B981] rounded-full opacity-60 transform -rotate-12"></div> */}
            </div>
            
            {/* Background Decorative Blobs */}
            {/* <div className="absolute top-10 right-10 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
            <div className="absolute bottom-10 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-1000"></div> */}
          </div>
        </div>
      </div>
    </div>
  );
}
