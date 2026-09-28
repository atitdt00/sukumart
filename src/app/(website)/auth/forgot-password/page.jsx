"use client";

import { useSignIn } from "@clerk/nextjs";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";

export default function ForgotPasswordPage() {
  const { signIn, isLoaded } = useSignIn();
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      code: "",
      password: "",
    },
  });

  // =====================================
  // STEP 1: SEND RESET CODE
  // =====================================
  const handleSendCode = async (data) => {
    if (!isLoaded) return;

    try {
      setLoading(true);

      await signIn.create({
        identifier: data.email.toLoweCase().trim(),
      });

      await signIn.resetPasswordEmailCode.sendCode();

      toast.success("Reset code sent to your email.");

      setStep(2);
    } catch (error) {
      console.error("Send reset code error:", error);

      toast.error(
        error?.errors?.[0]?.longMessage ||
          error?.errors?.[0]?.message ||
          "Unable to send reset code."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // STEP 2: VERIFY CODE
  // =====================================
  const handleVerifyCode = async (data) => {
    if (!isLoaded) return;

    try {
      setLoading(true);

      await signIn.resetPasswordEmailCode.verifyCode({
        code: data.code.trim(),
      });

      toast.success("Code verified successfully.");

      setStep(3);
    } catch (error) {
      console.error("Verify code error:", error);

      toast.error(
        error?.errors?.[0]?.longMessage ||
          error?.errors?.[0]?.message ||
          "Invalid verification code."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // STEP 3: RESET PASSWORD
  // =====================================
  const handleResetPassword = async (data) => {
    if (!isLoaded) return;

    try {
      setLoading(true);

      await signIn.resetPasswordEmailCode.submitPassword({
        password: data.password,
        signOutOfOtherSessions: true,
      });

      toast.success("Password reset successfully.");

      router.push("/");
    } catch (error) {
      console.error("Reset password error:", error);

      toast.error(
        error?.errors?.[0]?.longMessage ||
          error?.errors?.[0]?.message ||
          "Unable to reset password."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // CHANGE EMAIL
  // =====================================
  const handleChangeEmail = () => {
    setStep(1);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow">

        <h1 className="text-2xl font-bold text-center mb-2">
          Forgot Password
        </h1>

        <p className="text-gray-500 text-center mb-6">
          Reset your SukuMart customer password.
        </p>

        {/* =================================
            STEP 1
        ================================= */}
        {step === 1 && (
          <form
            onSubmit={handleSubmit(handleSendCode)}
            className="space-y-5"
          >
            <div>
              <label className="block mb-1 font-medium">
                Email
              </label>

              <input
                type="email"
                placeholder="Enter your email"
                autoComplete="email"
                {...register("email", {
                  required: "Email is required",

                  pattern: {
                    value:
                      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message:
                      "Enter a valid email address",
                  },
                })}
                className="w-full border rounded-lg px-4 py-3 outline-none focus:border-[#0055B3]"
              />

              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#002D62] hover:bg-[#0055B3] text-white py-3 rounded-lg font-semibold disabled:opacity-50"
            >
              {loading
                ? "Sending..."
                : "Send Reset Code"}
            </button>
          </form>
        )}

        {/* =================================
            STEP 2
        ================================= */}
        {step === 2 && (
          <form
            onSubmit={handleSubmit(handleVerifyCode)}
            className="space-y-5"
          >
            <div>
              <label className="block mb-1 font-medium">
                Verification Code
              </label>

              <input
                type="text"
                placeholder="Enter the code from your email"
                inputMode="numeric"
                maxLength={6}
                {...register("code", {
                  required:
                    "Verification code is required",

                  minLength: {
                    value: 6,
                    message:
                      "Verification code must be 6 digits",
                  },

                  maxLength: {
                    value: 6,
                    message:
                      "Verification code must be 6 digits",
                  },

                  pattern: {
                    value: /^\d+$/,
                    message:
                      "Verification code must contain only numbers",
                  },
                })}
                className="w-full border rounded-lg px-4 py-3 outline-none focus:border-[#0055B3]"
              />

              {errors.code && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.code.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#002D62] hover:bg-[#0055B3] text-white py-3 rounded-lg font-semibold disabled:opacity-50"
            >
              {loading
                ? "Verifying..."
                : "Verify Code"}
            </button>

            <button
              type="button"
              onClick={handleChangeEmail}
              className="w-full text-sm text-[#0055B3] hover:underline"
            >
              Change email
            </button>
          </form>
        )}

        {/* =================================
            STEP 3
        ================================= */}
        {step === 3 && (
          <form
            onSubmit={handleSubmit(handleResetPassword)}
            className="space-y-5"
          >
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
                    value: 15,
                    message:
                      "Password must be at least 15 characters",
                  },
                })}
                className="w-full border rounded-lg px-4 py-3 outline-none focus:border-[#0055B3]"
              />

              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}

              <p className="text-xs text-gray-500 mt-1">
                Password must be at least 15 characters.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#002D62] hover:bg-[#0055B3] text-white py-3 rounded-lg font-semibold disabled:opacity-50"
            >
              {loading
                ? "Resetting..."
                : "Reset Password"}
            </button>
          </form>
        )}

      </div>
    </div>
  );
}