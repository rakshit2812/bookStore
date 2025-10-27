import React, { useRef, useState } from "react";
import Navbar from "./Navbar";
import emailjs from "@emailjs/browser";
import Footer from "./Footer";
import Confirmation from "./Confirmation";
import { useTheme } from "../contexts/ThemeContext";

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { theme } = useTheme();
  
  const handleConfirm = () => {
    document.getElementById("my_modal_3_confirmation").showModal()
  }
  
  const form = useRef();
  
  const sendEmail = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    emailjs
      .sendForm("service_1sblf8r", "template_832t51f", form.current, {
        publicKey: "KY8BCd43R1HBg_Cla",
      })
      .then(
        () => {
          form.current.reset();
          setIsSubmitting(false);
          handleConfirm();
        },
        (error) => {
          console.log("Contact information sending FAILED...", error.text);
          setIsSubmitting(false);
        }
      );
  };

  
  return (
    <>
      <Navbar />
      <div className={`min-h-screen py-12 px-4 ${
        theme === "dark" 
          ? "bg-gradient-to-b from-black via-purple-950 to-slate-900" 
          : "bg-gradient-to-br from-teal-50 via-cyan-50 to-emerald-50"
      }`}>
        <div className="max-w-5xl mx-auto mt-24">
          {/* Header Section */}
          <div className="text-center mb-10">
            
            <h1 className={`text-4xl md:text-5xl font-bold mb-3 ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}>
              Contact Our Team
            </h1>
            <p className={`text-base md:text-lg max-w-2xl mx-auto ${
              theme === "dark" ? "text-gray-300" : "text-gray-600"
            }`}>
              Questions about our books or services? We're here to help. Expect a response within 24 hours.
            </p>
          </div>

          {/* Info Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
            <div className={`p-5 rounded-xl border ${
              theme === "dark" ? "bg-slate-800/50 border-slate-700" : "bg-white border-teal-100 shadow-sm"
            }`}>
              <div className="flex items-center space-x-3 mb-2">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  theme === "dark" ? "bg-teal-900/30" : "bg-teal-100"
                }`}>
                  <svg className={`w-5 h-5 ${
                    theme === "dark" ? "text-teal-400" : "text-teal-600"
                  }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className={`font-semibold ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}>Quick Response</h3>
              </div>
              <p className={`text-sm ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}>24-hour response time</p>
            </div>
            
            <div className={`p-5 rounded-xl border ${
              theme === "dark" ? "bg-slate-800/50 border-slate-700" : "bg-white border-cyan-100 shadow-sm"
            }`}>
              <div className="flex items-center space-x-3 mb-2">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  theme === "dark" ? "bg-cyan-900/30" : "bg-cyan-100"
                }`}>
                  <svg className={`w-5 h-5 ${
                    theme === "dark" ? "text-cyan-400" : "text-cyan-600"
                  }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className={`font-semibold ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}>Expert Team</h3>
              </div>
              <p className={`text-sm ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}>Knowledgeable support staff</p>
            </div>
            
            <div className={`p-5 rounded-xl border sm:col-span-2 lg:col-span-1 ${
              theme === "dark" ? "bg-slate-800/50 border-slate-700" : "bg-white border-emerald-100 shadow-sm"
            }`}>
              <div className="flex items-center space-x-3 mb-2">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  theme === "dark" ? "bg-emerald-900/30" : "bg-emerald-100"
                }`}>
                  <svg className={`w-5 h-5 ${
                    theme === "dark" ? "text-emerald-400" : "text-emerald-600"
                  }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className={`font-semibold ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}>Secure & Private</h3>
              </div>
              <p className={`text-sm ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}>Your data is protected</p>
            </div>
          </div>

          {/* Main Contact Form */}
          <div className={`max-w-2xl mx-auto rounded-2xl border ${
            theme === "dark" ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200 shadow-lg"
          }`}>
            <div className={`px-6 md:px-8 py-5 border-b ${
              theme === "dark" ? "border-slate-700" : "border-gray-200"
            }`}>
              <h2 className={`text-2xl font-bold ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}>Send a Message</h2>
              <p className={`mt-1 text-sm ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}>We'll respond as soon as possible</p>
            </div>
            
            <form ref={form} onSubmit={sendEmail} className="px-6 md:px-8 py-6">
              <div className="space-y-5">
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${
                    theme === "dark" ? "text-gray-200" : "text-gray-700"
                  }`}>
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    name="from_name"
                    type="text"
                    placeholder="Enter your full name"
                    className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all ${
                      theme === "dark"
                        ? "bg-slate-700 border-slate-600 text-white placeholder-gray-400"
                        : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500"
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-semibold mb-2 ${
                    theme === "dark" ? "text-gray-200" : "text-gray-700"
                  }`}>
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    name="from_email"
                    type="email"
                    placeholder="your.email@example.com"
                    className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all ${
                      theme === "dark"
                        ? "bg-slate-700 border-slate-600 text-white placeholder-gray-400"
                        : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500"
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-semibold mb-2 ${
                    theme === "dark" ? "text-gray-200" : "text-gray-700"
                  }`}>
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    name="message"
                    rows={5}
                    placeholder="Please describe your inquiry or feedback..."
                    className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all resize-none ${
                      theme === "dark"
                        ? "bg-slate-700 border-slate-600 text-white placeholder-gray-400"
                        : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500"
                    }`}
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3.5 rounded-lg font-semibold text-white transition-all ${
                    isSubmitting
                      ? "bg-gray-400 cursor-not-allowed"
                      : theme === "dark"
                        ? "bg-purple-600 hover:bg-purple-700 shadow-md hover:shadow-lg"
                        : "bg-teal-600 hover:bg-teal-700 shadow-md hover:shadow-lg"
                  }`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center space-x-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Sending...</span>
                    </span>
                  ) : (
                    <span className="flex items-center justify-center space-x-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span>Send Message</span>
                    </span>
                  )}
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
