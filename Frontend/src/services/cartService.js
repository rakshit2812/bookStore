import axios from "axios";
import { BASE_URL } from "../lib/base-url";

export const getCart = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/cart`);
        return response.data;
    } catch (error) {
        console.error("Error fetching cart:", error);
        throw error;
    }
};

export const addToCart = async (bookId, quantity) => {
    try {
        const response = await axios.post(`${BASE_URL}/cart/add`, { bookId, quantity });
        return response.data;
    } catch (error) {
        console.error("Error adding to cart:", error);
        throw error;
    }
};

export const updateCartItem = async (bookId, quantity) => {
    try {
        const response = await axios.put(`${BASE_URL}/cart/update`, { bookId, quantity });
        return response.data;
    } catch (error) {
        console.error("Error updating cart:", error);
        throw error;
    }
};

export const removeFromCart = async (bookId) => {
    try {
        const response = await axios.delete(`${BASE_URL}/cart/remove/${bookId}`);
        return response.data;
    } catch (error) {
        console.error("Error removing from cart:", error);
        throw error;
    }
};

export const clearCart = async () => {
    try {
        const response = await axios.delete(`${BASE_URL}/cart/clear`);
        return response.data;
    } catch (error) {
        console.error("Error clearing cart:", error);
        throw error;
    }
};