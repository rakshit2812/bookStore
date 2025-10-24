import axios from "axios";
import { BASE_URL } from "../lib/base-url";

export const createOrder = async (orderData) => {
    try {
        const response = await axios.post(`${BASE_URL}/order/create`, orderData);
        return response.data;
    } catch (error) {
        console.error("Order creation failed:", error);
        throw error;
    }
};

export const getUserOrders = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/order`);
        return response.data;
    } catch (error) {
        console.error("Error fetching orders:", error);
        throw error;
    }
};

export const cancelOrder = async (orderId) => {
    try {
        const response = await axios.put(`${BASE_URL}/order/cancel/${orderId}`);
        return response.data;
    } catch (error) {
        console.error("Error cancelling order:", error);
        throw error;
    }
};
