import express from "express";
import {
    createOrder,
    getUserOrders,
    getOrderById,
    cancelOrder
} from "../controllers/order_func.js";

const router = express.Router();

router.post("/create", createOrder);
router.get("/", getUserOrders);
router.get("/:orderId", getOrderById);
router.put("/cancel/:orderId", cancelOrder);

export default router;
