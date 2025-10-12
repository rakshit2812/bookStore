import React from "react";
import Navbar from "../components/Navbar";
import EnhancedBanner from "../components/EnhancedBanner";
import BookSection from "../components/BookSection";
import GridBookSection from "../components/GridBookSection";
import Footer from "../components/Footer";
import { useTheme } from "../contexts/ThemeContext";

export default function HomePage() {
  const { theme } = useTheme();
  
  return (
    <div className={theme === "dark" ? "bg-slate-950 min-h-screen" : "bg-white min-h-screen"}>
      <Navbar />
      <EnhancedBanner />
      
      {/* Top Rated Books Section - Purple Theme */}
      <div className="bg-gradient-to-br from-purple-50 via-lavender-50 to-white dark:from-slate-900 dark:via-purple-950 dark:to-slate-950">
        <BookSection 
          title="Top Rated Books"
          endpoint="featured"
          viewAllLink="/books?sort=rating"
          genre={true}
          colorScheme="purple"
        />
      </div>

      {/* Latest Additions Section - Teal Theme with Grid */}
      <div className="bg-gradient-to-br from-teal-50 via-cyan-50 to-white dark:from-slate-900 dark:via-teal-950 dark:to-slate-950">
        <GridBookSection 
          title="Latest Additions"
          endpoint="new-arrivals"
          viewAllLink="/books?filter=new"
          colorScheme="teal"
        />
      </div>

      {/* Upcoming Books Section - Coral/Rose Theme */}
      <div className="bg-gradient-to-br from-rose-50 via-pink-50 to-white dark:from-slate-900 dark:via-rose-950 dark:to-slate-950">
        <BookSection 
          title="Coming Soon"
          endpoint="upcoming"
          viewAllLink="/books?filter=upcoming"
          colorScheme="coral"
        />
      </div>

      <Footer />
    </div>
  );
}
