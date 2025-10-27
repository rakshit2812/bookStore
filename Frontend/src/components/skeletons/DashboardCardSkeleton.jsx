import React from "react";
import { useTheme } from "../../contexts/ThemeContext";

export default function DashboardCardSkeleton() {
  const { theme } = useTheme();

  return (
    <div className={`rounded-xl shadow-lg p-6 ${
      theme === "dark" ? "bg-slate-900" : "bg-white"
    } animate-pulse`}>
      {/* Label skeleton */}
      <div className={`h-4 rounded ${
        theme === "dark" ? "bg-slate-800" : "bg-gray-200"
      } w-24 mb-4`}></div>

      {/* Value and icon skeleton */}
      <div className="flex items-center justify-between mb-4">
        <div className={`h-10 rounded ${
          theme === "dark" ? "bg-slate-800" : "bg-gray-200"
        } w-32`}></div>
        <div className={`h-12 w-12 rounded-lg ${
          theme === "dark" ? "bg-slate-800" : "bg-gray-200"
        }`}></div>
      </div>

      {/* Trend skeleton */}
      <div className={`h-6 rounded-full ${
        theme === "dark" ? "bg-slate-800" : "bg-gray-200"
      } w-16`}></div>
    </div>
  );
}
