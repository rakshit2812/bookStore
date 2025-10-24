import axios from "axios";
import { BASE_URL } from "../lib/base-url";

export const getAnalytics = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/admin/analytics`);
        return response.data;
    } catch (error) {
        console.error("Error fetching analytics:", error);
        throw error;
    }
};

export const addBook = async (bookData) => {
    try {
        const response = await axios.post(`${BASE_URL}/admin/books`, bookData);
        return response.data;
    } catch (error) {
        console.error("Error adding book:", error);
        throw error;
    }
};

export const updateBook = async (bookId, bookData) => {
    try {
        const response = await axios.put(`${BASE_URL}/admin/books/${bookId}`, bookData);
        return response.data;
    } catch (error) {
        console.error("Error updating book:", error);
        throw error;
    }
};

export const deleteBook = async (bookId) => {
    try {
        const response = await axios.delete(`${BASE_URL}/admin/books/${bookId}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting book:", error);
        throw error;
    }
};

export const getOrderById = async (orderId) => {
    try {
        const response = await axios.get(`${BASE_URL}/admin/orders/${orderId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching order details:", error);
        throw error;
    }
};

export const updateOrderStatus = async (orderId, newStatus) => {
    try {
        const response = await axios.put(
            `${BASE_URL}/admin/orders/${orderId}/status`,
            { orderStatus: newStatus }
        );
        return response.data;
    } catch (error) {
        console.error("Error updating order status:", error);
        throw error;
    }
};

export const getUsers = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/admin/users`);
        return response.data;
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
};

export const getUserById = async (userId) => {
    try {
        const response = await axios.get(`${BASE_URL}/admin/users/${userId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching user details:", error);
        throw error;
    }
};

export const deleteUser = async (userId) => {
    try {
        const response = await axios.delete(`${BASE_URL}/admin/users/${userId}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting user:", error);
        throw error;
    }
};


export const getAdminProfile = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/admin/profile`);
        return response.data;
    } catch (error) {
        console.error("Error fetching profile:", error);
        throw error;
    }
};

export const updateAdminProfile = async (profileData) => {
    try {
        const response = await axios.put(`${BASE_URL}/admin/profile`, profileData);
        return response.data;
    } catch (error) {
        console.error("Error updating profile:", error);
        throw error;
    }
};

export const updateAdminPassword = async (passwordData) => {
    try {
        const response = await axios.put(`${BASE_URL}/admin/profile/password`, passwordData);
        return response.data;
    } catch (error) {
        console.error("Error updating password:", error);
        throw error;
    }
};