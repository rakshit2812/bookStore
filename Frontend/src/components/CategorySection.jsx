import React from "react";
import CategoryCard from "./CategoryCard";
import { useTheme } from "../contexts/ThemeContext";

export default function CategorySection() {
  const { theme } = useTheme();

  const categories = [
    { type: "bestsellers" },
    { type: "new-arrivals" },
    { type: "classics" },
    { type: "award-winners" }
  ];

  return (
    <div className="py-16">
      <div className="max-w-screen-2xl container mx-auto px-4 md:px-20">
        {/* Section Header */}
        <div className="mb-12">
          {/* Background Bar */}
          <div 
            className="h-1 w-20 mb-2 rounded-full"
            style={{
              background: "linear-gradient(90deg, #6B46C1 0%, transparent 100%)"
            }}
          ></div>
          
          {/* Section Title */}
          <h2 
            className={`font-bold mb-2 ${
              theme === "dark" ? "text-white" : "text-[#0F172A]"
            }`}
            style={{ 
              fontWeight: "700",
              fontSize: "2rem"
            }}
          >
            Browse Categories
          </h2>
          
          <p className={`text-lg ${
            theme === "dark" ? "text-gray-300" : "text-[#64748B]"
          }`}>
            Discover books by popular categories
          </p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <CategoryCard
              key={index}
              category={category.category}
              type={category.type}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
