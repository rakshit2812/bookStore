import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useConfirmation } from "../../contexts/ConfirmationContext";
import { getBooks, getCategories, getGenres } from "../../services/bookService";
import { addBook, updateBook, deleteBook } from "../../services/adminService";
import SearchBar from "../common/SearchBar";
import Filters from "../common/Filters";

export default function ManageBooks({ theme }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // "add" or "edit"
  const [selectedBook, setSelectedBook] = useState(null);
  const [bookToDelete, setBookToDelete] = useState(null);
  const { showConfirmation } = useConfirmation();
  
  // Search and Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [genreFilter, setGenreFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");
  
  // Dynamic options from API
  const [categories, setCategories] = useState([]);
  const [genres, setGenres] = useState([]);
  
  const [formData, setFormData] = useState({
    name: "",
    author: "",
    price: "",
    category: "Paid",
    genre: "",
    description: "",
    image: "",
    stock: "",
    rating: 0
  });

  useEffect(() => {
    fetchBooks();
    fetchCategories();
    fetchGenres();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await getBooks();
      setBooks(response);
    } catch (error) {
      console.error("Error fetching books:", error);
      toast.error("Failed to load books");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await getCategories();
      setCategories(response);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchGenres = async () => {
    try {
      const response = await getGenres();
      setGenres(response);
    } catch (error) {
      console.error("Error fetching genres:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddBook = () => {
    setModalMode("add");
    setFormData({
      name: "",
      author: "",
      price: "",
      category: "Paid",
      genre: "",
      description: "",
      image: "",
      stock: "",
      rating: 0
    });
    setShowModal(true);
  };

  const handleEditBook = (book) => {
    setModalMode("edit");
    setSelectedBook(book);
    setFormData({
      name: book.name || "",
      author: book.author || "",
      price: book.price || "",
      category: book.category || "Paid",
      genre: book.genre || "",
      description: book.description || "",
      image: book.image || "",
      stock: book.stock || "",
      rating: book.rating || 0
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const bookData = {
      ...formData,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      rating: parseFloat(formData.rating)
    };

    try {
      if (modalMode === "add") {
        // Cookie sent automatically
        await addBook(bookData);
        toast.success("Book added successfully!");
      } else {
        const confirmed = await showConfirmation({
          title: 'Update Book',
          message: 'Are you sure you want to update this book? All changes will be saved.',
          confirmText: 'Update Book',
          cancelText: 'Cancel',
          type: 'info',
        });

        if (!confirmed) return;

        // Cookie sent automatically
        await updateBook(selectedBook._id, bookData);
        toast.success("Book updated successfully!");
      }
      setShowModal(false);
      fetchBooks();
    } catch (error) {
      console.error("Error saving book:", error);
      toast.error(error.response?.data?.message || "Failed to save book");
    }
  };

  const confirmDeleteBook = (book) => {
    setBookToDelete(book);
    setShowDeleteModal(true);
  };

  const handleDeleteBook = async () => {
    if (!bookToDelete) return;

    try {
      // Cookie sent automatically
      await deleteBook(bookToDelete._id);
      toast.success("Book deleted successfully!");
      setShowDeleteModal(false);
      setBookToDelete(null);
      fetchBooks();
    } catch (error) {
      console.error("Error deleting book:", error);
      toast.error("Failed to delete book");
    }
  };

  // Get unique genres from books
  const uniqueGenres = [...new Set(books.map(book => book.genre))].filter(Boolean);

  // Filter and search books
  const filteredBooks = books.filter(book => {
    // Search filter
    const matchesSearch = searchQuery === "" || 
      book.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Category filter
    const matchesCategory = categoryFilter === "all" || book.category === categoryFilter;
    
    // Genre filter
    const matchesGenre = genreFilter === "all" || book.genre === genreFilter;
    
    // Rating filter
    const matchesRating = ratingFilter === "all" || 
      (ratingFilter === "4+" && book.rating >= 4) ||
      (ratingFilter === "3+" && book.rating >= 3) ||
      (ratingFilter === "below3" && book.rating < 3);
    
    return matchesSearch && matchesCategory && matchesGenre && matchesRating;
  });

  const handleSearchClear = () => {
    setSearchQuery("");
  };

  const handleClearFilters = () => {
    setCategoryFilter("all");
    setGenreFilter("all");
    setRatingFilter("all");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className={`text-4xl font-bold mb-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
            Manage Books
          </h1>
          <p className={`text-lg ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
            Add, edit, or remove books from your collection
          </p>
        </div>
        <button
          onClick={handleAddBook}
          className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add New Book
        </button>
      </div>

      {/* Search and Filters */}
      <div className={`rounded-xl shadow-lg p-6 ${theme === "dark" ? "bg-slate-900" : "bg-white"}`}>
        <div className="space-y-4">
          {/* Search */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
              Search Books
            </label>
            <SearchBar
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClear={handleSearchClear}
              placeholder="Search by title or author..."
            />
          </div>

          {/* Filters */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
              Filters
            </label>
            <div className="flex flex-col md:flex-row gap-4">
              <Filters
                categories={["all", ...categories]}
                genres={["all", ...genres]}
                selectedCategory={categoryFilter}
                selectedGenre={genreFilter}
                onCategoryChange={(e) => setCategoryFilter(e.target.value)}
                onGenreChange={(e) => setGenreFilter(e.target.value)}
                onClear={handleClearFilters}
                showSort={false}
              />
              
              {/* Rating Filter */}
              <select
                value={ratingFilter}
                onChange={(e) => setRatingFilter(e.target.value)}
                className={`select select-neutral ${
                  theme === "dark"
                    ? "bg-slate-800 border-slate-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
              >
                <option value="all">All Ratings</option>
                <option value="4+">4+ Stars</option>
                <option value="3+">3+ Stars</option>
                <option value="below3">Below 3 Stars</option>
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div>
            <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
              Showing <span className="font-bold text-orange-500">{filteredBooks.length}</span> of <span className="font-bold">{books.length}</span> books
            </p>
          </div>
        </div>
      </div>

      {/* Books Table */}
      <div className={`rounded-xl shadow-lg overflow-hidden ${theme === "dark" ? "bg-slate-900" : "bg-white"}`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={theme === "dark" ? "bg-slate-800" : "bg-gray-50"}>
              <tr>
                <th className={`px-6 py-4 text-left text-sm font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                  Book Name
                </th>
                <th className={`px-6 py-4 text-left text-sm font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                  Author
                </th>
                <th className={`px-6 py-4 text-left text-sm font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                  Price
                </th>
                <th className={`px-6 py-4 text-left text-sm font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                  Genre
                </th>
                <th className={`px-6 py-4 text-left text-sm font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                  Stock
                </th>
                <th className={`px-6 py-4 text-left text-sm font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                  Rating
                </th>
                <th className={`px-6 py-4 text-left text-sm font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredBooks.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center">
                    <p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>
                      {searchQuery || categoryFilter !== "all" || genreFilter !== "all" || ratingFilter !== "all"
                        ? "No books match your filters"
                        : "No books found"}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredBooks.map((book) => (
                  <tr
                    key={book._id}
                    className={`${theme === "dark" ? "hover:bg-slate-800" : "hover:bg-gray-50"} transition-colors`}
                  >
                    <td className={`px-6 py-4 ${theme === "dark" ? "text-gray-300" : "text-gray-900"}`}>
                      <div className="flex items-center gap-3">
                        <img
                          src={book.image || "/book1.png"}
                          alt={book.name}
                          className="w-12 h-16 object-cover rounded shadow-sm"
                        />
                        <div>
                          <p className="font-semibold">{book.name}</p>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            book.category === "Free" 
                              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                              : "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
                          }`}>
                            {book.category}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className={`px-6 py-4 text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-900"}`}>
                      {book.author}
                    </td>
                    <td className={`px-6 py-4 text-sm font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                      ₹{book.price}
                    </td>
                    <td className={`px-6 py-4 text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-900"}`}>
                      <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                        {book.genre}
                      </span>
                    </td>
                    <td className={`px-6 py-4 text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-900"}`}>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        book.stock > 10
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                          : book.stock > 0
                          ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300"
                          : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                      }`}>
                        {book.stock}
                      </span>
                    </td>
                    <td className={`px-6 py-4 text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-900"}`}>
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="font-semibold">{book.rating || 0}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditBook(book)}
                          className="px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all text-sm font-semibold"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => confirmDeleteBook(book)}
                          className="px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all text-sm font-semibold"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto ${
            theme === "dark" ? "bg-slate-900" : "bg-white"
          }`}>
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className={`text-2xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                  {modalMode === "add" ? "Add New Book" : "Edit Book"}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className={`text-2xl ${theme === "dark" ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900"}`}
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                      Book Title *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-4 py-2 rounded-lg border ${
                        theme === "dark"
                          ? "bg-slate-800 border-slate-700 text-white"
                          : "bg-white border-gray-300 text-gray-900"
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                      Author *
                    </label>
                    <input
                      type="text"
                      name="author"
                      value={formData.author}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-4 py-2 rounded-lg border ${
                        theme === "dark"
                          ? "bg-slate-800 border-slate-700 text-white"
                          : "bg-white border-gray-300 text-gray-900"
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                      Price (₹) *
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                      step="0.01"
                      className={`w-full px-4 py-2 rounded-lg border ${
                        theme === "dark"
                          ? "bg-slate-800 border-slate-700 text-white"
                          : "bg-white border-gray-300 text-gray-900"
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                      Stock *
                    </label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-4 py-2 rounded-lg border ${
                        theme === "dark"
                          ? "bg-slate-800 border-slate-700 text-white"
                          : "bg-white border-gray-300 text-gray-900"
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                      Category *
                    </label>
                    <select
                      name="category"
                      defaultValue={formData.category}
                      onChange={handleInputChange}
                      required
                      className={`select select-neutral ${
                        theme === "dark"
                          ? "bg-slate-800 border-slate-700 text-white"
                          : "bg-white border-gray-300 text-gray-900"
                      }`}
                    >
                      {categories.length > 0 ? (
                        categories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))
                      ) : (
                        <>
                          <option value="Free">Free</option>
                          <option value="Paid">Paid</option>
                        </>
                      )}
                    </select>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                      Genre *
                    </label>
                    <select
                      name="genre"
                      defaultValue={formData.genre}
                      onChange={handleInputChange}
                      required
                      className={`select select-neutral ${
                        theme === "dark"
                          ? "bg-slate-800 border-slate-700 text-white"
                          : "bg-white border-gray-300 text-gray-900"
                      }`}
                    >
                      <option value="">Select Genre</option>
                      {genres && genres.length > 0 && genres.map(genre => (
                        <option key={genre} value={genre}>{genre}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                      Rating (0-5)
                    </label>
                    <input
                      type="number"
                      name="rating"
                      value={formData.rating}
                      onChange={handleInputChange}
                      min="0"
                      max="5"
                      step="0.1"
                      className={`w-full px-4 py-2 rounded-lg border ${
                        theme === "dark"
                          ? "bg-slate-800 border-slate-700 text-white"
                          : "bg-white border-gray-300 text-gray-900"
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                      Image URL *
                    </label>
                    <input
                      type="url"
                      name="image"
                      value={formData.image}
                      onChange={handleInputChange}
                      required
                      placeholder="https://example.com/image.jpg"
                      className={`w-full px-4 py-2 rounded-lg border ${
                        theme === "dark"
                          ? "bg-slate-800 border-slate-700 text-white"
                          : "bg-white border-gray-300 text-gray-900"
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows="4"
                    className={`w-full px-4 py-2 rounded-lg border ${
                      theme === "dark"
                        ? "bg-slate-800 border-slate-700 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    }`}
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-red-700 transition-all"
                  >
                    {modalMode === "add" ? "Add Book" : "Update Book"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                      theme === "dark"
                        ? "bg-slate-800 text-white hover:bg-slate-700"
                        : "bg-gray-200 text-gray-900 hover:bg-gray-300"
                    }`}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && bookToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`rounded-xl shadow-2xl max-w-md w-full ${
            theme === "dark" ? "bg-slate-900" : "bg-white"
          }`}>
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-full bg-red-100 dark:bg-red-900/30">
                  <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className={`text-xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                    Delete Book
                  </h3>
                  <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                    This action cannot be undone
                  </p>
                </div>
              </div>

              <div className={`p-4 rounded-lg mb-6 ${theme === "dark" ? "bg-slate-800" : "bg-gray-50"}`}>
                <p className={`text-sm mb-2 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                  Are you sure you want to delete:
                </p>
                <p className={`font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                  {bookToDelete.name}
                </p>
                <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                  by {bookToDelete.author}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleDeleteBook}
                  className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-all"
                >
                  Delete Book
                </button>
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setBookToDelete(null);
                  }}
                  className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all ${
                    theme === "dark"
                      ? "bg-slate-800 text-white hover:bg-slate-700"
                      : "bg-gray-200 text-gray-900 hover:bg-gray-300"
                  }`}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
