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

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className={`w-full border-t ${
                  theme === "dark" ? "border-gray-700" : "border-gray-300"
                }`}></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className={`px-2 ${
                  theme === "dark" ? "bg-slate-900 text-gray-400" : "bg-white text-gray-500"
                }`}>
                  Or continue with
                </span>
              </div>
            </div>

            {/* Google Sign In Button */}
            <button
              onClick={() => window.location.href = `${BASE_URL}/google`}
              type="button"
              className={`w-full flex items-center justify-center gap-3 py-3 px-4 rounded-lg font-semibold border-2 transition-all transform hover:scale-[1.02] ${
                theme === "dark"
                  ? "border-slate-700 bg-slate-800 text-white hover:bg-slate-700"
                  : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
              } shadow-md hover:shadow-lg`}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span>Sign in with Google</span>
            </button>

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
