import express from "express";
import {
    getBook,
    getBooksFiltered,
    getBookById,
    getFeaturedBooks,
    getTrendingBooks,
    getNewArrivals,
    getUpcomingBooks,
    getGenres,
    getCategories
} from "../controllers/book_func.js";

const router = express.Router();

router.get("/", getBook);
router.get("/filter", getBooksFiltered);
router.get("/featured", getFeaturedBooks);
router.get("/trending", getTrendingBooks);
router.get("/new-arrivals", getNewArrivals);
router.get("/upcoming", getUpcomingBooks);
router.get("/genres", getGenres);
router.get("/categories", getCategories);
router.get("/:id", getBookById);

export default router
