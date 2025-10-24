import axios from "axios";
import { BASE_URL } from "../lib/base-url";

export const handleLogin = async (userInfo) => {
    try {
        const response = await axios.post(`${BASE_URL}/user/login`, userInfo);
        return response.data.user;
    } catch (error) {
        console.error("Login failed:", error);
        throw error;
    }
};

export const handleSignup = async (userInfo) => {
    try {
        const response = await axios.post(`${BASE_URL}/user/signup`, userInfo);
        return response.data.user;
    } catch (error) {
        console.error("Signup failed:", error);
        throw error;
    }
};