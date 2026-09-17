"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();

  const orderId = searchParams.get("order");

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-8 text-center">

        {/* Success Icon */}
        <div className="mx-auto mb-5 w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
          <span className="text-4xl text-green-600">✓</span>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-800">
          Payment Successful!
        </h1>

        <p className="text-gray-500 mt-2">
          Thank you for your order. Your payment has been successfully
          completed.
        </p>

        {/* Order ID */}
        {orderId && (
          <div className="mt-6 bg-gray-50 border rounded-lg p-4">
            <p className="text-sm text-gray-500">
              Order ID
            </p>

            <p className="font-bold text-[#002D62] mt-1">
              {orderId}
            </p>
          </div>
        )}

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mt-6">

          <Link
            href="/"
            className="flex-1 bg-[#002D62] text-white py-3 rounded-lg font-semibold hover:bg-[#0055B3] transition"
          >
            Continue Shopping
          </Link>

          {orderId && (
            <Link
              href={`/track_order?order=${orderId}`}
              className="flex-1 border border-[#002D62] text-[#002D62] py-3 rounded-lg font-semibold hover:bg-gray-50 transition"
            >
              Track Order
            </Link>
          )}

        </div>
      </div>
    </main>
  );
}

export default PaymentSuccessContent;