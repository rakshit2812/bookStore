import React from "react";
import toast from "react-hot-toast";

export default function Logout() {
  const handleLogout = () => {
    try {
      localStorage.removeItem("token");
      toast.success("Logged out succesfully");
      setTimeout(() => {
        window.location.reload();
        }, 1000);
    } catch (error) {
      toast.error(error.message);
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
