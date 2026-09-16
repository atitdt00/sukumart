"use client";

import React, { useState } from "react";
import { useModal } from "../../context/ModalContext";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useSignUp } from "@clerk/nextjs";

function SignupModal() {
  const { closeSignup, openLogin, showSignup } = useModal();
  const [showVerification, setShowVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [loading, setLoading] = useState(false);

  //clerk registration
  const { signUp } = useSignUp();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirm_password: "",
    },
  });

  //Get password value
  const password = watch("password");

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const { error } = await signUp.password({
        emailAddress: data.email,
        password: data.password,
      });

      console.log("SIGNUP ERROR:", error);
      console.log("SIGNUP STATUS:", signUp.status);
      console.log("MISSING FIELDS:", signUp.missingFields);
      console.log("UNVERIFIED FIELDS:", signUp.unverifiedFields);

      if (error) {
        console.error("CLERK ERRORS:", JSON.stringify(error?.errors, null, 2));

        toast.error(
          error?.errors?.[0]?.longMessage ||
            error?.errors?.[0]?.message ||
            "Registration failed",
        );

        return;
      }

      //save user's name in clerk
      const { error: updateError }= await signUp.update({
        firstName: data.name,
      })

      if(updateError){
        console.error( "Name Update Error: ", JSON.stringify(updateError?.errors, null, 2 ))

        toast.error( updateError?.errors?.[0]?.longMessage || updateError?.errors?.[0]?.message || "Failed to save user name")
        return;
      }

      // Send verification code
      const { error: verificationError } =
        await signUp.verifications.sendEmailCode();

      if (verificationError) {
        console.error(
          "VERIFICATION ERROR:",
          JSON.stringify(verificationError?.errors, null, 2),
        );

        toast.error(
          verificationError?.errors?.[0]?.longMessage ||
            "Could not send verification code",
        );

        return;
      }

      console.log("Verification code sent successfully");

      toast.success("Verification code sent to your email");

      setShowVerification(true);

      // We will show the verification form here next.
    } catch (error) {
      console.error("FULL CLERK SIGNUP ERROR:", error);

      console.error("CLERK ERRORS:", JSON.stringify(error?.errors, null, 2));

      console.error("SIGNUP STATUS:", signUp.status);
      console.error("MISSING FIELDS:", signUp.missingFields);
      console.error("UNVERIFIED FIELDS:", signUp.unverifiedFields);

      toast.error(
        error?.errors?.[0]?.longMessage ||
          error?.errors?.[0]?.message ||
          "Registration failed",
      );
    } finally {
      setLoading(false);
    }
  };

  const verifyEmail = async () => {
    try {
      setLoading(true);

      const { error } = await signUp.verifications.verifyEmailCode({
        code: verificationCode,
      });

      if (error) {
        toast.error(
          error?.errors?.[0]?.longMessage ||
            error?.errors?.[0]?.message ||
            "Invalid verification code",
        );
        return;
      }

      console.log("STATUS AFTER VERIFICATION:", signUp.status);

      if (signUp.status === "complete") {
        await signUp.finalize();

        toast.success("Account created successfully!");

        setShowVerification(false);
        closeSignup();
        openLogin();
      }
    } catch (error) {
      console.error("Verification error:", error);
      toast.error("Email verification failed");
    } finally {
      setLoading(false);
    }
  };

  if (!showSignup) return null;

  return (
    <div
      id="SignupModal"
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 py-6"
      onClick={closeSignup}
    >
      {/* Modal */}
      <div
        className="w-full max-w-2xl max-h-[95vh] overflow-y-auto bg-white rounded-2xl shadow-2xl border border-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#002D62] to-[#0055B3] text-white px-8 py-7 text-center relative">
          <h2 className="text-3xl font-bold">Create Account</h2>

          <p className="text-white/70 text-sm mt-2">Join Sukumart today</p>

          {/* Close button */}
          <button
            type="button"
            onClick={closeSignup}
            className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Body */}
        <div className="p-8">
          {showVerification ? (
            <div className="space-y-5">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-800">
                  Verify Your Email
                </h3>

                <p className="text-gray-500 text-sm mt-2">
                  We sent a verification code to your email address.
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">
                  Verification Code
                </label>

                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="Enter verification code"
                  className="w-full px-4 py-3.5 border border-gray-200 rounded-xl outline-none focus:ring-4 focus:ring-blue-100 focus:border-[#0055B3] transition"
                />
              </div>

              <button
                type="button"
                onClick={verifyEmail}
                disabled={loading}
                className="w-full bg-[#002D62] hover:bg-[#0055B3] text-white py-3.5 rounded-xl font-semibold transition"
              >
                {loading ? "Verifying..." : "Verify Email"}
              </button>
            </div>
          ) : (
            <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">
                  Full Name
                </label>

                <input
                  type="text"
                  {...register("name", { required: "Name is required" })}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3.5 border border-gray-200 rounded-xl outline-none focus:ring-4 focus:ring-blue-100 focus:border-[#0055B3] transition"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {" "}
                    {errors.name.message}{" "}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">
                  Email
                </label>

                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-3.5 border border-gray-200 rounded-xl outline-none focus:ring-4 focus:ring-blue-100 focus:border-[#0055B3] transition"
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
                    {" "}
                    {errors.email.message}{" "}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">
                  Password
                </label>

                <input
                  type="password"
                  placeholder="Create password"
                  className="w-full px-4 py-3.5 border border-gray-200 rounded-xl outline-none focus:ring-4 focus:ring-blue-100 focus:border-[#0055B3] transition"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 15,
                      message: "Password must be at least 15 characters",
                    },
                  })}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {" "}
                    {errors.password.message}{" "}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">
                  Confirm Password
                </label>

                <input
                  type="password"
                  {...register("confirm_password", {
                    required: "please confirm your password",
                    validate: (value) =>
                      value === password || "password do not match",
                  })}
                  placeholder="Confirm password"
                  className="w-full px-4 py-3.5 border border-gray-200 rounded-xl outline-none focus:ring-4 focus:ring-blue-100 focus:border-[#0055B3] transition"
                />
                {errors.confirm_password && (
                  <p className="text-red-500 text-sm mt-1">
                    {" "}
                    {errors.confirm_password.message}{" "}
                  </p>
                )}
              </div>
              <div id="clerk-captcha" />

              {/* Create Account */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#002D62] hover:bg-[#0055B3] text-white py-3.5 rounded-xl font-semibold transition hover:-translate-y-0.5"
              >
                {loading ? "Creating account..." : "Create Account"}
              </button>
            </form>
          )}

          {/* Login */}
          <p className="text-center text-sm text-gray-500 pt-6">
            Already have an account?{" "}
            <button
              type="button"
              onClick={openLogin}
              disabled={loading}
              className="text-[#0055B3] font-semibold hover:underline"
            >
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignupModal;
