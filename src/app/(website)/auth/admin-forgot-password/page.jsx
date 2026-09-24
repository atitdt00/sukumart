
"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import axios from "axios";

function AdminForgotPassword() {
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(
        "/api/auth/forgot-password",
        {
          email: data.email,
        }
      );

      if (response.data.success) {
        setSent(true);

        toast.success(
          response.data.message ||
            "Password reset link sent to your email."
        );
      }
    } catch (error) {
      console.error(
        "Admin forgot password error:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
          "Something went wrong. Please try again." 
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow">
        <h1 className="text-2xl font-bold text-center mb-2">
          Admin Forgot Password
        </h1>

        <p className="text-gray-500 text-center mb-6">
          Enter your admin email and we&apos;ll send you
          a password reset link.
        </p>

        {!sent ? (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
          >
            {/* Email */}
            <div>
              <label className="block mb-1 font-medium">
                Admin Email
              </label>

              <input
                type="email"
                placeholder="Enter admin email"
                autoComplete="email"
                {...register("email", {
                  required: "Email is required",

                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message:
                      "Enter a valid email address",
                  },
                })}
                className="w-full border rounded-lg px-4 py-3 outline-none focus:border-blue-500"
              />

              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#002D62] hover:bg-[#0055B3] text-white py-3 rounded-lg font-semibold disabled:opacity-50 transition"
            >
              {isSubmitting
                ? "Sending..."
                : "Send Reset Link"}
            </button>
          </form>
        ) : (
          <div className="text-center">
            <p className="text-green-600 font-medium">
              Check your email for the password reset
              link.
            </p>
          </div>
        )}

        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-blue-600 hover:underline"
          >
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AdminForgotPassword;

