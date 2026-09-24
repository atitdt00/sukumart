
"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import axios from "axios";

function AdminResetPassword() {
  const { token } = useParams();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const password = watch("password");

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(
        "/api/auth/reset-password",
        {
          token,
          password: data.password,
        }
      );

      if (response.data.success) {
        toast.success(
          response.data.message ||
            "Password reset successfully."
        );

        setTimeout(() => {
          router.push("/");
        }, 1500);
      }
    } catch (error) {
      console.error(
        "Admin reset password error:",
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
          Reset Admin Password
        </h1>

        <p className="text-gray-500 text-center mb-6">
          Enter your new admin password below.
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
        >
          {/* New Password */}
          <div>
            <label className="block mb-1 font-medium">
              New Password
            </label>

            <input
              type="password"
              placeholder="Enter new password"
              autoComplete="new-password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message:
                    "Password must be at least 6 characters",
                },
              })}
              className="w-full border rounded-lg px-4 py-3 outline-none focus:border-blue-500"
            />

            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block mb-1 font-medium">
              Confirm Password
            </label>

            <input
              type="password"
              placeholder="Confirm new password"
              autoComplete="new-password"
              {...register("confirmPassword", {
                required:
                  "Please confirm your password",
                validate: (value) =>
                  value === password ||
                  "Passwords do not match",
              })}
              className="w-full border rounded-lg px-4 py-3 outline-none focus:border-blue-500"
            />

            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword.message}
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
              ? "Updating..."
              : "Reset Password"}
          </button>
        </form>

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

export default AdminResetPassword;

