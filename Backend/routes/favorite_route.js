import express from "express";
import {
    getFavorites,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite
} from "../controllers/favorite_func.js";

const router = express.Router();

router.get("/", getFavorites);
router.post("/add", addToFavorites);
router.post("/toggle", toggleFavorite);
router.delete("/remove/:bookId", removeFromFavorites);

export default router;
