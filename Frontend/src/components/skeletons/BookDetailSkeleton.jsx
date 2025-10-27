import React from "react";
import { useTheme } from "../../contexts/ThemeContext";

export default function BookDetailSkeleton() {
  const { theme } = useTheme();

  return (
    <div className={`rounded-2xl shadow-2xl overflow-hidden ${
      theme === "dark" ? "bg-slate-900" : "bg-white"
    } animate-pulse`}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8 md:p-12">
        {/* Left Side - Image Skeleton */}
        <div className="flex justify-center items-start">
          <div className="w-full max-w-md">
            <div className={`aspect-[3/4] rounded-xl ${
              theme === "dark" ? "bg-slate-800" : "bg-gray-200"
            }`}></div>
          </div>
        </div>

        {/* Right Side - Details Skeleton */}
        <div className="space-y-6">
          {/* Title skeleton */}
          <div className="space-y-2">
            <div className={`h-10 rounded ${
              theme === "dark" ? "bg-slate-800" : "bg-gray-200"
            } w-3/4`}></div>
            <div className={`h-6 rounded ${
              theme === "dark" ? "bg-slate-800" : "bg-gray-200"
            } w-1/2`}></div>
          </div>

          {/* Rating skeleton */}
          <div className={`h-6 rounded ${
            theme === "dark" ? "bg-slate-800" : "bg-gray-200"
          } w-40`}></div>

          {/* Badges skeleton */}
          <div className="flex gap-3">
            <div className={`h-10 rounded-full ${
              theme === "dark" ? "bg-slate-800" : "bg-gray-200"
            } w-24`}></div>
            <div className={`h-10 rounded-full ${
              theme === "dark" ? "bg-slate-800" : "bg-gray-200"
            } w-20`}></div>
          </div>

          {/* Description skeleton */}
          <div className="space-y-2">
            <div className={`h-6 rounded ${
              theme === "dark" ? "bg-slate-800" : "bg-gray-200"
            } w-32`}></div>
            <div className={`h-4 rounded ${
              theme === "dark" ? "bg-slate-800" : "bg-gray-200"
            } w-full`}></div>
            <div className={`h-4 rounded ${
              theme === "dark" ? "bg-slate-800" : "bg-gray-200"
            } w-full`}></div>
            <div className={`h-4 rounded ${
              theme === "dark" ? "bg-slate-800" : "bg-gray-200"
            } w-2/3`}></div>
          </div>

          {/* Stock skeleton */}
          <div className={`h-6 rounded ${
            theme === "dark" ? "bg-slate-800" : "bg-gray-200"
          } w-48`}></div>

          {/* Price skeleton */}
          <div className={`h-12 rounded ${
            theme === "dark" ? "bg-slate-800" : "bg-gray-200"
          } w-32`}></div>

          {/* Quantity selector skeleton */}
          <div className="flex items-center gap-4">
            <div className={`h-6 rounded ${
              theme === "dark" ? "bg-slate-800" : "bg-gray-200"
            } w-24`}></div>
            <div className="flex items-center gap-3">
              <div className={`h-10 w-10 rounded-full ${
                theme === "dark" ? "bg-slate-800" : "bg-gray-200"
              }`}></div>
              <div className={`h-8 rounded ${
                theme === "dark" ? "bg-slate-800" : "bg-gray-200"
              } w-12`}></div>
              <div className={`h-10 w-10 rounded-full ${
                theme === "dark" ? "bg-slate-800" : "bg-gray-200"
              }`}></div>
            </div>
          </div>

          {/* Action buttons skeleton */}
          <div className="flex gap-4 pt-4">
            <div className={`flex-1 h-14 rounded-lg ${
              theme === "dark" ? "bg-slate-800" : "bg-gray-200"
            }`}></div>
            <div className={`h-14 w-14 rounded-lg ${
              theme === "dark" ? "bg-slate-800" : "bg-gray-200"
            }`}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
