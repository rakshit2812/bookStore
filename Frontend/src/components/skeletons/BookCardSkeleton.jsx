import React from "react";
import { useTheme } from "../../contexts/ThemeContext";

export default function BookCardSkeleton() {
  const { theme } = useTheme();

  return (
    <div className={`rounded-xl shadow-lg overflow-hidden ${
      theme === "dark" ? "bg-slate-900" : "bg-white"
    } animate-pulse`}>
      {/* Image skeleton */}
      <div className={`aspect-[3/4] ${
        theme === "dark" ? "bg-slate-800" : "bg-gray-200"
      }`}></div>

      {/* Content skeleton */}
      <div className="p-4 space-y-3">
        {/* Title skeleton */}
        <div className={`h-5 rounded ${
          theme === "dark" ? "bg-slate-800" : "bg-gray-200"
        } w-3/4`}></div>

        {/* Author skeleton */}
        <div className={`h-4 rounded ${
          theme === "dark" ? "bg-slate-800" : "bg-gray-200"
        } w-1/2`}></div>

        {/* Rating skeleton */}
        <div className="flex items-center gap-2">
          <div className={`h-4 rounded ${
            theme === "dark" ? "bg-slate-800" : "bg-gray-200"
          } w-20`}></div>
        </div>

        {/* Genre badge skeleton */}
        <div className={`h-6 rounded-full ${
          theme === "dark" ? "bg-slate-800" : "bg-gray-200"
        } w-24`}></div>

        {/* Price and button skeleton */}
        <div className="flex items-center justify-between mt-4">
          <div className={`h-6 rounded ${
            theme === "dark" ? "bg-slate-800" : "bg-gray-200"
          } w-20`}></div>
          <div className={`h-10 rounded-lg ${
            theme === "dark" ? "bg-slate-800" : "bg-gray-200"
          } w-28`}></div>
        </div>
      </div>
    </div>
  );
}
