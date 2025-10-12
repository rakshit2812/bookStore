import React from "react";
import { Link } from "react-router-dom";
import { Star, Trophy, Sparkles, BookOpen } from "lucide-react";

export default function CategoryCard({ category, type }) {
  const getCategoryConfig = () => {
    switch (type) {
      case "bestsellers":
        return {
          title: "Bestsellers",
          description: "Most popular books",
          icon: <Star className="w-8 h-8 text-white opacity-90" />,
          gradient: "linear-gradient(135deg, #E91E8C 0%, #8B2E6F 100%)",
          textColor: "#FFFFFF",
          link: "/books?category=bestsellers"
        };
      case "new-arrivals":
        return {
          title: "New Arrivals",
          description: "Latest additions",
          icon: <Sparkles className="w-8 h-8 text-white opacity-90" />,
          gradient: "linear-gradient(135deg, #14B8A6 0%, #10B981 100%)",
          textColor: "#FFFFFF",
          badge: { bg: "#F59E0B", text: "#FFFFFF", label: "NEW" },
          link: "/books?category=new"
        };
      case "classics":
        return {
          title: "Classics",
          description: "Timeless literature",
          icon: <BookOpen className="w-8 h-8 text-[#FEF3C7] opacity-90" />,
          gradient: "linear-gradient(135deg, #78350F 0%, #9F1239 100%)",
          textColor: "#FEF3C7",
          accent: "#FBBF24",
          link: "/books?category=classics"
        };
      case "award-winners":
        return {
          title: "Award Winners",
          description: "Critically acclaimed",
          icon: <Trophy className="w-8 h-8 text-[#FEF3C7] opacity-90" />,
          gradient: "linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)",
          textColor: "#0F172A",
          accent: "#FEF3C7",
          link: "/books?category=awards"
        };
      default:
        return {
          title: category,
          description: "Explore books",
          icon: <BookOpen className="w-8 h-8 text-white opacity-90" />,
          gradient: "linear-gradient(135deg, #6B46C1 0%, #8B5CF6 100%)",
          textColor: "#FFFFFF",
          link: `/books?category=${category?.toLowerCase()}`
        };
    }
  };

  const config = getCategoryConfig();

  return (
    <Link to={config.link} className="block group">
      <div
        className="relative p-6 rounded-2xl overflow-hidden transition-all duration-300 hover:scale-103 cursor-pointer"
        style={{
          background: config.gradient,
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)"
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = "0 12px 40px rgba(0, 0, 0, 0.2)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = "0 8px 32px rgba(0, 0, 0, 0.1)";
        }}
      >
        {/* Badge for New Arrivals */}
        {config.badge && (
          <div
            className="absolute top-4 right-4 px-2 py-1 rounded-full text-xs font-semibold"
            style={{
              backgroundColor: config.badge.bg,
              color: config.badge.text
            }}
          >
            {config.badge.label}
          </div>
        )}

        {/* Icon */}
        <div className="mb-4">
          {config.icon}
        </div>

        {/* Content */}
        <div>
          <h3
            className="text-2xl font-bold mb-2"
            style={{ color: config.textColor }}
          >
            {config.title}
          </h3>
          <p
            className="text-sm opacity-90"
            style={{ color: config.textColor }}
          >
            {config.description}
          </p>
        </div>

        {/* Decorative Element for Classics */}
        {config.accent && type === "classics" && (
          <div
            className="absolute bottom-4 right-4 w-12 h-1 rounded-full"
            style={{ backgroundColor: config.accent }}
          ></div>
        )}

        {/* Decorative Element for Award Winners */}
        {config.accent && type === "award-winners" && (
          <div
            className="absolute bottom-4 right-4"
            style={{ color: config.accent }}
          >
            <Trophy className="w-6 h-6" />
          </div>
        )}

        {/* Hover Effect Overlay */}
        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl"></div>
      </div>
    </Link>
  );
}
