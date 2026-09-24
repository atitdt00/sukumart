"use client";
import { useSignIn } from "@clerk/nextjs";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useForm } from "react-hook-form";

import { toast } from "react-toastify";

function page() {
  const { signIn, isLoaded } = useSignIn();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      email: "",
      code: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data) => {
    if(!isLoaded) return ;
    try {
      await signIn.create({
        identifier: data.email,
      });

      await signIn.prepareFirstFactor({
        strategy: "reset_password_email_code",
      })

      await signIn.resetPasswordEmailCode();

      toast.success("password reset code send to your email.");
      setStep(2);
    } catch (error) {
      console.error(error);
      toast.error(
        error?.errors?.[0]?.longMessage ||
          error?.errors?.[0]?.message ||
          "Something went wrong",
      );
    }
  };

  //step 2: verify code and reset password

  const resetPassword = async (data) => {
    if (!isLoaded) return;
    if (data.password !== data.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    try {
      await signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code: data.code,
      });
      await signIn.resetPassword({ password: data.password });
      toast.success("Password reset successfully.");
      redirect("/sign-in");
    } catch (error) {
      console.error("Reset password error:", error);
      toast.error(
        error?.errors?.[0]?.longMessage ||
          error?.errors?.[0]?.message ||
          "Something went wrong",
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow">
        <h1 className="text-2xl font-bold text-center mb-2">
          Forgot Password?
        </h1>

        <p className="text-gray-500 text-center mb-6">
          Enter your email and we&apos;ll send you a password reset link.
        </p>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="block mb-1 font-medium">Email</label>

            <input
              type="email"
              placeholder="Enter your email"
              {...register("email", {
                required: "Email is Required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid Email address",
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

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#0055B3] text-white py-3 rounded-lg font-semibold disabled:opacity-50"
          >
            {isSubmitting ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <div className="text-center mt-6">
          <Link href="/" className="text-blue-600 hover:underline">
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default page;
