import React from "react";
import { Link } from "react-router-dom";
import Login from "./Login";
import { useForm } from "react-hook-form";


export default function Signup() {
    const {
        register,
        handleSubmit,
        formState: { errors },
      } = useForm();
      const onSubmit = (data) => console.log(data);
      const theme = localStorage.getItem("theme");
  return (
    <div className={`flex h-screen justify-center items-center ${theme==="dark" && "bg-slate-950"}`} >
      <div id="my_modal" className="w-[600px]">
        <div className={`modal-box  ${theme==="dark"?"bg-slate-900":"bg-white"}`}>
          <form onSubmit={handleSubmit(onSubmit)} method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <Link
              to="/"
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            >
              ✕
            </Link>

            <h3 className="font-bold text-lg text-white">Signup</h3>
            <div className="mt-4 space-y-2">
              <span className="text-white">Name</span>
              <br />
              <input
                type="text"
                placeholder="Enter your Fullname"
                className="w-80 bg-white px-3 py-1 border rounded-md text-black"
                {...register("name", { required: true })}
              />
              <br />
              {errors.name && (
                <span className=" text-sm text-red-600">
                  This field is required
                </span>
              )}
            </div>
            <div className="mt-4 space-y-2">
              <span className="text-white">Email</span>
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
              <span className="text-white">Password</span>
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
              <p className="text-xl text-white">
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
