import express from "express";
import {
    getAnalytics,
    getAllUsers,
    getUserDetails,
    deleteUser,
    updateBook,
    deleteBook,
    createBook,
    getAllOrders,
    getOrderDetails,
    updateOrderStatus,
    getAdminProfile,
    updateAdminProfile,
    changeAdminPassword
} from "../controllers/admin_func.js";
import { checkAdminAuth } from "../middlewares/adminAuth.js";

const router = express.Router();

// All routes require admin authentication
router.use(checkAdminAuth);

// Analytics routes
router.get("/analytics", getAnalytics);

// Admin profile routes
router.get("/profile", getAdminProfile);
router.put("/profile", updateAdminProfile);
router.put("/profile/password", changeAdminPassword);

// User management routes
router.get("/users", getAllUsers);
router.get("/users/:userId", getUserDetails);
router.delete("/users/:userId", deleteUser);

// Book management routes
router.post("/books", createBook);
router.put("/books/:bookId", updateBook);
router.delete("/books/:bookId", deleteBook);

// Order management routes
router.get("/orders", getAllOrders);
router.get("/orders/:orderId", getOrderDetails);
router.put("/orders/:orderId/status", updateOrderStatus);

export default router;
