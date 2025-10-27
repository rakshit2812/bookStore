import Book from "../models/book.js"

export const getBook = async (req,res) => {
    try {
        const book = await Book.find();
        res.status(200).json(book);
    } catch (error) {
        console.log("Error Encountered in fetching books : ", error)
        res.status(500).json(error);
    }
}

// Get books with filtering and search
export const getBooksFiltered = async (req, res) => {
    try {
        const {
            search,
            genre,
            category,
            minPrice,
            maxPrice,
            sortBy,
            page = 1,
            limit = 10
        } = req.query;

        let query = {};

        // Search by name, title, or author
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { title: { $regex: search, $options: 'i' } },
                { author: { $regex: search, $options: 'i' } }
            ];
        }

        // Filter by genre
        if (genre && genre !== 'all') {
            query.genre = genre;
        }

        // Filter by category
        if (category && category !== 'all') {
            query.category = category;
        }

        // Filter by price range
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        // Sorting with _id as tiebreaker for consistent pagination
        let sortOptions = {};
        switch (sortBy) {
            case 'price_asc':
                sortOptions = { price: 1, _id: 1 };
                break;
            case 'price_desc':
                sortOptions = { price: -1, _id: 1 };
                break;
            case 'rating':
                sortOptions = { rating: -1, _id: 1 };
                break;
            case 'newest':
                sortOptions = { createdAt: -1, _id: 1 };
                break;
            default:
                sortOptions = { createdAt: -1, _id: 1 };
        }

        const skip = (Number(page) - 1) * Number(limit);

        const books = await Book.find(query)
            .sort(sortOptions)
            .skip(skip)
            .limit(Number(limit));

        const total = await Book.countDocuments(query);
        const totalPages = Math.ceil(total / Number(limit));

        // Debug logging
        console.log(`Pagination Debug: page=${page}, limit=${limit}, skip=${skip}, total=${total}, totalPages=${totalPages}, returned=${books.length}`);

        res.status(200).json({
            books,
            currentPage: Number(page),
            totalPages,
            totalBooks: total,
            limit: Number(limit)
        });
    } catch (error) {
        console.error("Error in getBooksFiltered:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get book by ID
export const getBookById = async (req, res) => {
    try {
        const { id } = req.params;
        const book = await Book.findById(id);
        
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        res.status(200).json(book);
    } catch (error) {
        console.log("Error in getBookById:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get featured books (top rated)
export const getFeaturedBooks = async (req, res) => {
    try {
        const books = await Book.find()
            .sort({ rating: -1 })
            .limit(8);
        
        res.status(200).json(books);
    } catch (error) {
        console.log("Error in getFeaturedBooks:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get trending books
export const getTrendingBooks = async (req, res) => {
    try {
        const books = await Book.find({ isTrending: true })
            .sort({ rating: -1 })
            .limit(10);
        
        res.status(200).json(books);
    } catch (error) {
        console.log("Error in getTrendingBooks:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get new arrivals
export const getNewArrivals = async (req, res) => {
    try {
        const books = await Book.find({ isNewArrival: true })
            .sort({ createdAt: -1 })
            .limit(10);
        
        res.status(200).json(books);
    } catch (error) {
        console.log("Error in getNewArrivals:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get upcoming books
export const getUpcomingBooks = async (req, res) => {
    try {
        const books = await Book.find({ isUpcoming: true })
            .sort({ publishedDate: -1 })
            .limit(10);
        
        res.status(200).json(books);
    } catch (error) {
        console.log("Error in getUpcomingBooks:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get all genres
export const getGenres = async (req, res) => {
    try {
        const genres = await Book.distinct('genre');
        res.status(200).json(genres.filter(Boolean)); // Filter out null/undefined
    } catch (error) {
        console.log("Error in getGenres:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get all categories
export const getCategories = async (req, res) => {
    try {
        const categories = await Book.distinct('category');
        res.status(200).json(categories.filter(Boolean)); // Filter out null/undefined
    } catch (error) {
        console.log("Error in getCategories:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
