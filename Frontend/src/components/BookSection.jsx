import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BookCard from "./BookCard";
import BookCardSkeleton from "./skeletons/BookCardSkeleton";
import Slider from "react-slick";
import { ArrowRight } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { getBooks, getGenres } from "../services/bookService";

// Custom Arrow Components
const NextArrow = (props) => {
  const { onClick } = props;
  return (
    <div
      className="absolute right-0 top-1/2 -translate-y-1/2 z-10 cursor-pointer bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 rounded-full p-3 shadow-lg transition-all"
      onClick={onClick}
      style={{ right: '-20px' }}
    >
      <svg
        className="w-6 h-6 text-white"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5l7 7-7 7"
        />
      </svg>
    </div>
  );
};

const PrevArrow = (props) => {
  const { onClick } = props;
  return (
    <div
      className="absolute left-0 top-1/2 -translate-y-1/2 z-10 cursor-pointer bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 rounded-full p-3 shadow-lg transition-all"
      onClick={onClick}
      style={{ left: '-20px' }}
    >
      <svg
        className="w-6 h-6 text-white"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 19l-7-7 7-7"
        />
      </svg>
    </div>
  );
};

export default function BookSection({ title, endpoint, viewAllLink, genre, colorScheme = "purple" }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [genres, setGenres] = useState([]);
  const { theme } = useTheme();

  // Color scheme mapping
  const colorSchemes = {
    purple: {
      title: "text-purple-700 dark:text-purple-300",
      accent: "bg-gradient-to-r from-purple-500 to-indigo-600",
      button: "bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800",
    },
    teal: {
      title: "text-teal-700 dark:text-teal-300",
      accent: "bg-gradient-to-r from-teal-500 to-cyan-600",
      button: "bg-gradient-to-r from-teal-600 to-cyan-700 hover:from-teal-700 hover:to-cyan-800",
    },
    coral: {
      title: "text-rose-700 dark:text-rose-300",
      accent: "bg-gradient-to-r from-rose-500 to-pink-600",
      button: "bg-gradient-to-r from-rose-600 to-pink-700 hover:from-rose-700 hover:to-pink-800",
    },
  };

  const colors = colorSchemes[colorScheme] || colorSchemes.purple;

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await getBooks(endpoint);
        setBooks(response);
      } catch (error) {
        console.error("Error fetching books:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [endpoint]);

  useEffect(() => {
    if (genre) {
      const fetchGenres = async () => {
        try {
          const response = await getGenres();
          setGenres(["all", ...response]);
        } catch (error) {
          console.error("Error fetching genres:", error);
        }
      };
      fetchGenres();
    }
  }, [genre]);

  const filteredBooks = selectedGenre === "all" 
    ? books 
    : books.filter(book => book.genre === selectedGenre);

  // const settings = {
  //   dots: true,
  //   infinite: filteredBooks.length > 4,
  //   speed: 500,
  //   slidesToShow: 4,
  //   slidesToScroll: 1,
  //   autoplay: true,
  //   autoplaySpeed: 300,
  //   pauseOnHover: false,
  //   arrows: true,
  //   responsive: [
  //     {
  //       breakpoint: 1280,
  //       settings: {
  //         slidesToShow: 3,
  //         slidesToScroll: 1,
  //       },
  //     },
  //     {
  //       breakpoint: 1024,
  //       settings: {
  //         slidesToShow: 2,
  //         slidesToScroll: 1,
  //       },
  //     },
  //     {
  //       breakpoint: 640,
  //       settings: {
  //         slidesToShow: 1,
  //         slidesToScroll: 1,
  //         arrows: false,
  //       },
  //     },
  //   ],
  // };
  var settings = {
    dots: true,
    infinite: true,
    speed: 700,
    slidesToShow: 4,
    slidesToScroll: 1,
    initialSlide: 0,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: true,
          arrows: false,
        },
      },
    ],
  };

  if (loading) {
    return (
      <div className="py-16">
        <div className="max-w-screen-2xl container mx-auto px-4 md:px-20">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
            <div>
              <div className={`h-1 w-20 mb-2 rounded-full ${
                theme === "dark" ? "bg-slate-800" : "bg-gray-200"
              } animate-pulse`}></div>
              <div className={`h-8 w-48 rounded ${
                theme === "dark" ? "bg-slate-800" : "bg-gray-200"
              } animate-pulse`}></div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <BookCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16">
      <div className="max-w-screen-2xl container mx-auto px-4 md:px-20">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
          <div>
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
              {title}
            </h2>
          </div>

          <div className="flex items-center gap-4">

            {/* View All Link */}
            {viewAllLink && (
              <Link
                to={viewAllLink}
                className="flex items-center gap-2 text-[#14B8A6] hover:text-[#0D9488] font-medium transition-colors group"
              >
                View All
                <ArrowRight className="w-4 h-4 text-[#14B8A6] group-hover:text-[#0D9488] transition-colors" />
              </Link>
            )}
          </div>
        </div>

        {/* Books Carousel */}
        {filteredBooks.length === 0 ? (
          <div className={`text-center py-12 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
            No books found
          </div>
        ) : (
          <div className="mt-8 relative px-8">
            <Slider {...settings}>
              {filteredBooks.map((book) => (
                <div key={book._id} className="px-3">
                  <BookCard book={book} />
                </div>
              ))}
            </Slider>
          </div>
        )}
      </div>
    </div>
  );
}
