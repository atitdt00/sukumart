"use client"
import React, { useState } from "react";

function page() {
  const [openSignup, setOpenSignup]=useState(false);
  const [loading, setLoading]=useState(false);
  return (
    <>
      {/* <!-- SIGNUP MODAL / SECTION --> */}
      <div className="flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* <!-- Header --> */}
          <div className="bg-gradient-to-r from-[#002D62] to-[#0055B3] text-white p-6 text-center">
            <h2 className="text-2xl font-bold">Create Account</h2>
            <p className="text-white/70 text-sm mt-1">Join Sukumart today</p>
          </div>

          {/* <!-- Body --> */}
          <div className="p-6 space-y-4"> 
            {/* <!-- Name --> */}
            <div>
              <label className="text-sm font-semibold text-gray-600">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Enter your name"
                className="w-full mt-1 px-4 py-3 border rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-[#0055B3] outline-none transition"
              />
            </div>

            {/* <!-- Email --> */}
            <div>
              <label className="text-sm font-semibold text-gray-600">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full mt-1 px-4 py-3 border rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-[#0055B3] outline-none transition"
              />
            </div>

            {/* <!-- Password --> */}
            <div>
              <label className="text-sm font-semibold text-gray-600">
                Password
              </label>
              <input
                type="password"
                placeholder="Create password"
                className="w-full mt-1 px-4 py-3 border rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-[#0055B3] outline-none transition"
              />
            </div>

            {/* <!-- Confirm Password --> */}
            <div>
              <label className="text-sm font-semibold text-gray-600">
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="Confirm password"
                className="w-full mt-1 px-4 py-3 border rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-[#0055B3] outline-none transition"
              />
            </div>

            {/* <!-- Button --> */}
            <button className="w-full bg-[#002D62] hover:bg-[#0055B3] text-white py-3 rounded-xl font-semibold transition transform hover:-translate-y-0.5">
              Create Account
            </button>

            {/* <!-- Login link --> */}
            <p className="text-center text-sm text-gray-500 pt-2">
              Already have an account?
              <button className="text-[#0055B3] font-semibold hover:underline">
                Login
              </button>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default page;
