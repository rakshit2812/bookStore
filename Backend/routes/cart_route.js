import express from "express";
import {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart
} from "../controllers/cart_func.js";
import { requireAuth } from "../middlewares/midAuth.js";

const router = express.Router();

// All cart routes require authentication
router.use(requireAuth);

router.get("/", getCart);
router.post("/add", addToCart);
router.put("/update", updateCartItem);
router.delete("/remove/:bookId", removeFromCart);
router.delete("/clear", clearCart);

export default router;
