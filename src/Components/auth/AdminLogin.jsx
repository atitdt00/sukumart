"use client";

import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "../../Services/Auth_Service";
import { useModal } from "../../context/ModalContext";

function AdminLogin() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const { showAdmin, closeAdmin } = useModal();

  const {
    register,
    handleSubmit,
    formState: { errors: formErrors },
    reset,
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  // Admin login
  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const response = await loginUser(data);

      if (!response.success) {
        toast.error(response?.message || "Admin login failed");
        return;
      }

      reset();

      toast.success("Admin login successful");

      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      console.error("Admin login error:", error);
      toast.error(error?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  if (!showAdmin) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[999] px-4"
      onClick={closeAdmin}
    >
      <div
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-linear-to-r from-[#002D62] to-[#0055B3] p-6 text-white">
          <h1 className="text-2xl font-bold text-center">SukuMart Admin</h1>

          <p className="text-white/70 text-center text-sm mt-1">
            Login to your dashboard
          </p>

          {/* <!-- close --> */}
          <button
            id="closeLogin"
            type="button"
            onClick={closeAdmin}
            className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <div>
              <label className="text-sm font-semibold text-gray-600">
                Email
              </label>

              <input
                type="email"
                placeholder="Enter admin email"
                className="w-full mt-1 px-4 py-3 border rounded-xl outline-none focus:ring-4 focus:ring-blue-100 focus:border-[#0055B3] transition"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+\.\S+$/,
                    message: "Please enter a valid email",
                  },
                })}
              />

              {formErrors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {formErrors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="text-sm font-semibold text-gray-600">
                Password
              </label>

              <input
                type="password"
                placeholder="Enter admin password"
                className="w-full mt-1 px-4 py-3 border rounded-xl outline-none focus:ring-4 focus:ring-blue-100 focus:border-[#0055B3] transition"
                {...register("password", {
                  required: "Password is required",
                })}
              />

              {formErrors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {formErrors.password.message}
                </p>
              )}
            </div>

            {/* Remember me */}
            <div className="flex justify-between items-center">
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input
                  type="checkbox"
                  className="accent-[#0055B3]"
                  {...register("remember")}
                />
                Remember me
              </label>

              <button
                type="button"
                onClick={ () =>{ router.push("/auth/admin-forgot-password"); closeAdmin()}}
                className="text-sm text-[#0055B3] hover:underline cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#002D62] hover:bg-[#0055B3] disabled:opacity-60 text-white py-3 rounded-xl font-semibold transition hover:-translate-y-0.5"
            >
              {loading ? "Logging in..." : "Admin Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
