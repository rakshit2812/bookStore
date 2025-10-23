import express from "express";
import {
    createOrder,
    getUserOrders,
    getOrderById,
    cancelOrder
} from "../controllers/order_func.js";
import { requireAuth } from "../middlewares/midAuth.js";

const router = express.Router();

// All order routes require authentication
router.use(requireAuth);

router.post("/create", createOrder);
router.get("/", getUserOrders);
router.get("/:orderId", getOrderById);
router.put("/cancel/:orderId", cancelOrder);

export default router;
