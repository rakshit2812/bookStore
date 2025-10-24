import axios from "axios";
import { BASE_URL } from "../lib/base-url";

export const getBooks = async (endpoint="") => {
    if(!endpoint) endpoint="";
    try {
        const response = await axios.get(`${BASE_URL}/book/${endpoint}`, {
          withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching books:", error);
        throw error;
    }
};

export const getBookById = async (id) => {
    try {
        const response = await axios.get(`${BASE_URL}/book/${id}`, {
          withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching book:", error);
        throw error;
    }
};

export const searchBooks = async (searchTerm) => {
    try {
        const response = await axios.get(`${BASE_URL}/book/search?search=${searchTerm}`, {
          withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error("Error searching books:", error);
        throw error;
    }
};

export const filterBooks = async (filters) => {
    try {
        const response = await axios.get(`${BASE_URL}/book/filter`, {
          withCredentials: true,
          params: filters,
        });
        return response.data;
    } catch (error) {
        console.error("Error filtering books:", error);
        throw error;
    }
};

export const getGenres = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/book/genres`, {
          withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching genres:", error);
        throw error;
    }
};

export const getCategories = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/book/categories`, {
          withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching categories:", error);
        throw error;
    }
};