import React from "react";
import { useTheme } from "../../contexts/ThemeContext";

export default function CartItemSkeleton() {
  const { theme } = useTheme();

  return (
    <div className={`rounded-xl shadow-lg p-6 ${
      theme === "dark" ? "bg-slate-900" : "bg-white"
    } animate-pulse`}>
      <div className="flex flex-col sm:flex-row gap-6">
        {/* Book Image Skeleton */}
        <div className={`w-32 h-44 rounded-lg ${
          theme === "dark" ? "bg-slate-800" : "bg-gray-200"
        }`}></div>

        {/* Book Details Skeleton */}
        <div className="flex-1 space-y-4">
          {/* Title skeleton */}
          <div className={`h-6 rounded ${
            theme === "dark" ? "bg-slate-800" : "bg-gray-200"
          } w-3/4`}></div>

          {/* Author skeleton */}
          <div className={`h-4 rounded ${
            theme === "dark" ? "bg-slate-800" : "bg-gray-200"
          } w-1/2`}></div>

          {/* Price skeleton */}
          <div className={`h-8 rounded ${
            theme === "dark" ? "bg-slate-800" : "bg-gray-200"
          } w-24`}></div>

          {/* Quantity controls skeleton */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className={`h-8 w-8 rounded-full ${
                theme === "dark" ? "bg-slate-800" : "bg-gray-200"
              }`}></div>
              <div className={`h-6 rounded ${
                theme === "dark" ? "bg-slate-800" : "bg-gray-200"
              } w-8`}></div>
              <div className={`h-8 w-8 rounded-full ${
                theme === "dark" ? "bg-slate-800" : "bg-gray-200"
              }`}></div>
            </div>
            <div className={`h-6 rounded ${
              theme === "dark" ? "bg-slate-800" : "bg-gray-200"
            } w-20`}></div>
          </div>

          {/* Item total skeleton */}
          <div className={`h-6 rounded ${
            theme === "dark" ? "bg-slate-800" : "bg-gray-200"
          } w-32`}></div>
        </div>
      </div>
    </div>
  );
}
