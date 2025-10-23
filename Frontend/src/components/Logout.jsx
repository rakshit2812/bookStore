import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { BASE_URL } from "../lib/base-url";
import { clearUserData } from "../utils/auth";

export default function Logout() {
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    try {
      // Call backend to clear the HttpOnly cookie
      // withCredentials is now set globally, cookies sent automatically
      await axios.post(`${BASE_URL}/user/logout`, {});
      
      // Clear user data from sessionStorage
      clearUserData();
      
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      // Even if backend call fails, clear local data
      clearUserData();
      toast.success("Logged out successfully");
      navigate("/login");
    }
  };
  return (
    <div>
      <button
        onClick={handleLogout}
        className=" px-3 py-2 bg-red-500 text-white cursor-pointer rounded-md"
      >
        Logout
      </button>
    </div>
  );
}
