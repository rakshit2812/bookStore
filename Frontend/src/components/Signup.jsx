import React from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import Login from "./Login";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";

export default function Signup() {
  const Navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const userInfo = {
      fullname: data.fullname,
      email: data.email,
      password: data.password,
    };
    await axios
      .post("https://bookstore-gvbx.onrender.com/user/signup", userInfo)
      .then((res) => {
        console.log(res.data);
        // console.log(res.data.token);
        localStorage.setItem("token", res.data.token);
        if (localStorage.getItem("token")) {
          toast.success("signup successfull!");
          Navigate("/");
        }
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response.data.message);
          toast.error(error.response.data.message);
        }
      });
  };
  const theme = localStorage.getItem("theme");
  return (
    <div
      className={`flex h-screen justify-center items-center ${
        theme === "dark" && "bg-slate-950"
      }`}
    >
      <div id="my_modal" className="w-[600px]">
        <div
          className={`modal-box  ${
            theme === "dark" ? "bg-slate-900" : "bg-white"
          }`}
        >
          <form onSubmit={handleSubmit(onSubmit)} method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <Link
              to="/"
              className={`btn btn-sm btn-circle btn-ghost absolute right-2 top-2 ${
                theme === "dark" ? "text-white" : "text-black"
              }`}
            >
              ✕
            </Link>

            <h3
              className={`font-bold text-lg ${
                theme === "dark" ? "text-white" : "text-black"
              }`}
            >
              Signup
            </h3>
            <div className="mt-4 space-y-2">
              <span
                className={`${theme === "dark" ? "text-white" : "text-black"}`}
              >
                Name
              </span>
              <br />
              <input
                type="text"
                placeholder="Enter your Fullname"
                className="w-80 bg-white px-3 py-1 border rounded-md text-black"
                {...register("fullname", { required: true })}
              />
              <br />
              {errors.fullname && (
                <span className=" text-sm text-red-600">
                  This field is required
                </span>
              )}
            </div>
            <div className="mt-4 space-y-2">
              <span
                className={`${theme === "dark" ? "text-white" : "text-black"}`}
              >
                Email
              </span>
              <br />
              <input
                type="email"
                placeholder="Enter your email"
                className="w-80 bg-white px-3 py-1 border rounded-md text-black"
                {...register("email", { required: true })}
              />
              <br />
              {errors.email && (
                <span className=" text-sm text-red-600">
                  This field is required
                </span>
              )}
            </div>
            {/* <p className="py-4">Press ESC key or click on ✕ button to close</p> */}
            <div className="mt-4 space-y-2">
              <span
                className={`${theme === "dark" ? "text-white" : "text-black"}`}
              >
                Password
              </span>
              <br />
              <input
                type="password"
                placeholder="Enter your Password"
                className="w-80 bg-white px-3 py-1 border rounded-md text-black"
                {...register("password", { required: true })}
              />
              <br />
              {errors.password && (
                <span className=" text-sm text-red-600">
                  This field is required
                </span>
              )}
            </div>
            <div className="flex justify-around mt-4">
              <button className="px-3 py-1 rounded-md font-semibold login-button">
                Signup
              </button>
              <p
                className={`text-xl ${
                  theme === "dark" ? "text-white" : "text-black"
                }`}
              >
                Already registered?{" "}
                <span
                  className=" cursor-pointer text-blue-500 underline"
                  onClick={() =>
                    document.getElementById("my_modal_3").showModal()
                  }
                >
                  Login
                </span>
              </p>
            </div>
          </form>
          <Login />
        </div>
      </div>
    </div>
  );
}
