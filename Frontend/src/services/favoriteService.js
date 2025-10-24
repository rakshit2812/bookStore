import axios from "axios";
import { BASE_URL } from "../lib/base-url";

export const toggleFavorite = async (bookId) => {
    try {
        const response = await axios.post(`${BASE_URL}/favorite/toggle`, { bookId });
        return response.data;
    } catch (error) {
        console.error("Error toggling favorite:", error);
        throw error;
    }
};

export const getUserFavorites = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/favorite`);
        return response.data;
    } catch (error) {
        console.error("Error fetching favorites:", error);
        throw error;
    }
};