import React from "react";

export default function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="text-center">
        <div className="relative">
          {/* Outer spinning ring */}
          <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-pink-500 mx-auto"></div>
          
          {/* Inner pulsing circle */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="h-12 w-12 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full animate-pulse"></div>
          </div>
        </div>
        
        <p className="mt-6 text-lg font-semibold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
          Loading...
        </p>
      </div>
    </div>
  );
}
