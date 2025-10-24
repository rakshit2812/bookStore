import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import { BASE_URL } from "../lib/base-url";
import { setUserData } from "../utils/auth";
import { handleLogin } from "../services/userService";

export default function LoginPage() {
  const navigate = useNavigate();
  const theme = localStorage.getItem("theme");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const userInfo = {
      email: data.email,
      password: data.password,
    };

    try{
      const response = await handleLogin(userInfo);
      // Store user data in sessionStorage (token is in HttpOnly cookie)
      setUserData(response);
      if (response.email) {
          toast.success("Login successful!");
          // Redirect to admin dashboard if user is admin
          if (response.role === "admin") {
            navigate("/admin");
          } else {
            navigate("/");
          }
        }
    }
    catch(error){
      if (error.response) {
          console.log(error.response.data.message);
          toast.error(error.response.data.message);
        }
    }



    // withCredentials is now set globally, cookies sent/received automatically
    // await axios
    //   .post(`${BASE_URL}/user/login`, userInfo)
    //   .then((res) => {
    //     console.log(res.data);
    //     // Store user data in sessionStorage (token is in HttpOnly cookie)
    //     setUserData(res.data.user);
        
    //     if (res.data.user.email) {
    //       toast.success("Login successful!");
    //       // Redirect to admin dashboard if user is admin
    //       if (res.data.user.role === "admin") {
    //         navigate("/admin");
    //       } else {
    //         navigate("/");
    //       }
    //     }
    //   })
    //   .catch((error) => {
    //     if (error.response) {
    //       console.log(error.response.data.message);
    //       toast.error(error.response.data.message);
    //     }
    //   });
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 ${
        theme === "dark" ? "bg-slate-950" : "bg-gradient-to-br from-pink-50 to-purple-50"
      }`}
    >
      <div
        className={`flex flex-col lg:flex-row w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden ${
          theme === "dark" ? "bg-slate-900" : "bg-white"
        }`}
      >
        {/* Left Side - Image Section */}
        <div className="lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-pink-500 to-purple-600 p-12 flex flex-col justify-center items-center">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[url('/book1.png')] bg-cover bg-center"></div>
          </div>
          <div className="relative z-10 text-center">
            <div className="mb-6">
              <svg
                className="w-24 h-24 mx-auto text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">
              Welcome Back
            </h1>
            <p className="text-pink-100 text-lg mb-8">
              Discover your next great read in our curated collection
            </p>
            <div className="flex flex-col space-y-4 text-white">
              <div className="flex items-center space-x-3">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Thousands of books at your fingertips</span>
              </div>
              <div className="flex items-center space-x-3">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Personalized recommendations</span>
              </div>
              <div className="flex items-center space-x-3">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Exclusive member benefits</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form Section */}
        <div className="lg:w-1/2 p-12 flex flex-col justify-center">
          <div className="w-full max-w-md mx-auto">
            <Link
              to="/"
              className={`inline-flex items-center space-x-2 mb-8 text-sm font-medium transition-colors ${
                theme === "dark"
                  ? "text-gray-400 hover:text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              <span>Back to Home</span>
            </Link>

            <h2
              className={`text-3xl font-bold mb-2 ${
                theme === "dark" ? "text-white" : "text-gray-800"
              }`}
            >
              Login
            </h2>
            <p
              className={`mb-8 ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Enter your credentials to access your account
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all ${
                    theme === "dark"
                      ? "bg-slate-800 border-slate-700 text-white placeholder-gray-500"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                  } ${errors.email ? "border-red-500" : ""}`}
                  {...register("email", { required: true })}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">
                    Email is required
                  </p>
                )}
              </div>

              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all ${
                    theme === "dark"
                      ? "bg-slate-800 border-slate-700 text-white placeholder-gray-500"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                  } ${errors.password ? "border-red-500" : ""}`}
                  {...register("password", { required: true })}
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500">
                    Password is required
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-700 transform hover:scale-[1.02] transition-all shadow-lg hover:shadow-xl"
              >
                Sign In
              </button>
            </form>

            <div className="mt-8 text-center">
              <p
                className={`text-sm ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="font-semibold text-pink-500 hover:text-pink-600 transition-colors"
                >
                  Sign up now
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
