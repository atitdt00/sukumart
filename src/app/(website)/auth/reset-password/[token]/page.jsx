"use client";

import Link from "next/link";
import React from "react";
import { useForm } from "react-hook-form";
import { resetPassword } from "../../../../../Services/Auth_Service";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";

function page() {
  const { token } = useParams();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const password = watch("password");

  const onSubmit = async (data) => {
    try {
      const response = await resetPassword(token, data.password);
      if (response.success) {
        toast.success(response.message);
        setTimeout(()=>{
            router.push("/"); 
        },2000)
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Something went wrong. Please try again")
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow">
        <h1 className="text-2xl font-bold text-center mb-2">Reset Password</h1>
        <p className="text-gray-500 text-center mb-6">
          Enter your new password below.
        </p>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="block mb-1 font-medium">New Password</label>

            <input
              type="password"
              placeholder="Enter new password"
              {...register("password", {
                required: "password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              minLength={6}
              className="w-full border rounded-lg px-4 py-3 outline-none focus:border-blue-500"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {" "}
                {errors.password.message}{" "}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-1 font-medium">Confirm Password</label>

            <input
              type="password"
              placeholder="Confirm new password"
              {...register("confirmPassword", {
                required: "please confirm your password",
                validate: (value) =>
                  value === password || " password do not match",
              })}
              minLength={6}
              className="w-full border rounded-lg px-4 py-3 outline-none focus:border-blue-500"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {" "}
                {errors.confirmPassword.message}{" "}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-[#0055B3] text-white py-3 rounded-lg font-semibold disabled:opacity-50"
          >
            {isSubmitting ? "Updating..." : " Reset Password"}
          </button>
        </form>
        {/* Back */}{" "}
        <div className="text-center mt-6">
          {" "}
          <Link href="/" className="text-blue-600 hover:underline">
            {" "}
            Back to home{" "}
          </Link>{" "}
        </div>
      </div>
    </div>
  );
}

export default page;
