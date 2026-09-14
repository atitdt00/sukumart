"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { loginUser } from "../../Services/Auth_Service";
import { useState } from "react";
import { useModal } from "../../context/ModalContext";
import { useRouter } from "next/navigation";

function LoginModal() {
  //context openlogin
  const { showLogin, closeLogin, openSignup } = useModal();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const response = await loginUser({
        email: data.email,
        password: data.password,
      });
      if (!response?.success) {
        toast.error(response?.message || "Login failed");
        return;
      }

      reset({
        email: "",
        password: "",
      });

      closeLogin();
      if (response.user?.role === "admin") {
        router.push("/dashboard");
        router.refresh();
      } else {
        router.push("/");
        router.refresh();
      }
      toast.success(response.message || "Login successfully");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Login failed !");
    } finally {
      setLoading(false);
    }
  };
  if (!showLogin) return null;
  return (
    <>
      {/* <!-- loginModal --> */}
      <div
        id="loginModal"
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[999] px-4"
        onClick={closeLogin}
      >
        <div
          className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-fadeIn"
          onClick={(e) => e.stopPropagation()}
        >
          {/* <!-- Header --> */}
          <div className="bg-linear-to-r from-[#002D62] to-[#0055B3] p-6 text-white relative">
            <h2 className="text-2xl font-bold">Welcome Back 👋</h2>
            <p className="text-white/70 text-sm mt-1">Login to your account</p>

            {/* <!-- close --> */}
            <button
              id="closeLogin"
              type="button"
              onClick={closeLogin}
              className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>

          {/* <!-- Body --> */}
          <div className="p-6 space-y-4">
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* <!-- Email --> */}
              <div>
                <label className="text-sm font-semibold text-gray-600">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full mt-1 px-4 py-3 border rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-[#0055B3] transition"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^\S+@\S+\.\S+$/,
                      message: "Please enter a valid email",
                    },
                  })}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* <!-- Password --> */}
              <div>
                <label className="text-sm font-semibold text-gray-600">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  className="w-full mt-1 px-4 py-3 border rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-[#0055B3] transition"
                  {...register("password", {
                    required: "password is required",
                  })}
                />
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">
                    {" "}
                    {errors.password.message}{" "}
                  </p>
                )}
              </div>

              {/* <!-- Remember + Forgot --> */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-gray-600">
                  <input
                    type="checkbox"
                    className="accent-[#0055B3]"
                    {...register("remember")}
                  />
                  Remember me
                </label>

                <Link
                  href="/auth/forgot-password"
                  onClick={closeLogin}
                  className="text-[#0055B3] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              {/* <!-- Button --> */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#002D62] hover:bg-[#0055B3] text-white py-3 rounded-xl font-semibold transition hover:-translate-y-0.5"
              >
                {loading ? "logging In..." : "login"}
              </button>
            </form>

            {/* <!-- Divider --> */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="text-xs text-gray-400">OR</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            {/* <!-- Social --> */}
            <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center gap-2 border rounded-xl py-2 hover:bg-gray-50">
                <i className="fa-brands fa-google text-red-500"></i> Google
              </button>

              <button className="flex items-center justify-center gap-2 border rounded-xl py-2 hover:bg-gray-50">
                <i className="fa-brands fa-facebook text-blue-600"></i> Facebook
              </button>
            </div>

            {/* <!-- Signup --> */}
            <p className="text-center text-sm text-gray-500 mt-2">
              Don&apos;t have an account?
              <button
                type="button"
                onClick={openSignup}
                className="text-[#0055B3] font-semibold hover:underline"
              >
                Sign up
              </button>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginModal;
