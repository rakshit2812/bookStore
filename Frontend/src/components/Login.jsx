import React from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";

export default function Login() {
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
    await axios
      .post("https://bookstore-gvbx.onrender.com/user/login", userInfo, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      })
      .then((res) => {
        console.log(res.data);
        localStorage.setItem("token", res.data.token);
        if (res.data.user.email) {
          toast.success("login successfull!");
          document.getElementById("my_modal_3").close();

          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response.data.message);
          toast.error(error.response.data.message);
          // alert();
        }
      });
  };
  return (
    <div>
      <dialog id="my_modal_3" className="modal">
        <div className="modal-box bg-white  dark:bg-slate-900">
          <form onSubmit={handleSubmit(onSubmit)} method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <span
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={() => document.getElementById("my_modal_3").close()}
            >
              ✕
            </span>
            {/* </form> */}
            <h3 className="font-bold text-lg">Login</h3>
            <div className="mt-4 space-y-2">
              <span>Email</span>
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
              <span>Password</span>
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
                Login
              </button>
              <p>
                Not Registered?{" "}
                <Link
                  to="/signup"
                  className=" cursor-pointer text-blue-500 underline"
                >
                  Signup now
                </Link>
              </p>
            </div>
          </form>
        </div>
      </dialog>
    </div>
  );
}
