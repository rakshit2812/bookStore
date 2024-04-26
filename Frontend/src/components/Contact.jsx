import React, { useRef, useState } from "react";
import Navbar from "./Navbar";
import emailjs from "@emailjs/browser";
// import { Link } from "react-router-dom";
import Footer from "./Footer";
import About from "./About";
import Confirmation from "./Confirmation";

export default function Contact() {
    const handleConfirm = () => {
      document.getElementById("my_modal_3_confirmation").showModal()
    }
  const form = useRef();
  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm("service_1sblf8r", "template_832t51f", form.current, {
        publicKey: "KY8BCd43R1HBg_Cla",
      })
      .then(
        () => {
          form.current.reset();
          console.log("hpgya");
          handleConfirm();
        },
        (error) => {
          console.log("FAILED...", error.text);
        }
      );
  };

  const theme = localStorage.getItem("theme");
  return (
    <>
      <Navbar />
      <div
        className={`flex flex-col h-[720px] justify-center items-center `}>
        <div id="my_modal" className="w-full py-4 px-[8%] md:px-[30%]">
          <div
            className={` `}
          >
            <form ref={form} onSubmit={sendEmail}>
              <h3 className="font-bold text-4xl dark:text-pink-400">Contact Us</h3>
              <div className="mt-4 space-y-1">
                <span className=" dark:text-pink-400">Name</span>
                <br />
                <input
                  name="from_name"
                  type="text"
                  placeholder="Enter your Fullname"
                  className="w-full bg-white px-3 py-1 border rounded-md text-black"
                />
              </div>
              <div className="mt-4 space-y-1">
                <span className=" dark:text-pink-400">Email</span>
                <br />
                <input
                  required
                  name="from_email"
                  type="email"
                  placeholder="Enter your email address"
                  className="w-full bg-white px-3 py-1 border rounded-md text-black"
                />
              </div>
              {/* <p className="py-4">Press ESC key or click on ✕ button to close</p> */}
              <div className="mt-4 space-y-1">
                <span className=" dark:text-pink-400">Message</span>
                <br />
                <textarea
                  required
                  name="message"
                  rows={5}
                  placeholder="Enter your Messsage"
                  className="w-full bg-white px-3 py-1 border rounded-md text-black custom-contact"
                ></textarea>
              </div>
              <div className="flex mt-4 px-1">
                <button
                  type="submit"
                  value="send"
                  className="px-4 py-2 rounded-md font-semibold bg-blue-500 dark:bg-pink-500"
                >
                  Submit
                </button>
                
              </div>
            </form>
            <Confirmation/>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
