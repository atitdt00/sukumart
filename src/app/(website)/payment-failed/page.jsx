
"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

function Page() {
  const searchParams = useSearchParams();

  const orderId = searchParams.get("order");

  return (
    <section className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center">

        {/* FAILURE ICON */}
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-100 flex items-center justify-center">
          <span className="text-4xl text-red-600">✕</span>
        </div>

        {/* TITLE */}
        <h1 className="text-3xl font-bold text-gray-800">
          Payment Failed
        </h1>

        {/* MESSAGE */}
        <p className="text-gray-500 mt-3">
          Unfortunately, your eSewa payment could not be completed.
        </p>

        {/* ORDER ID */}
        {orderId && (
          <div className="mt-6 bg-gray-50 border border-gray-200 rounded-xl p-4">
            <p className="text-sm text-gray-500">
              Order ID
            </p>

            <p className="text-xl font-bold text-[#002D62] mt-1">
              {orderId}
            </p>
          </div>
        )}

        <p className="text-sm text-gray-500 mt-5">
          Your order has not been marked as paid.
          Please try the payment again.
        </p>

        {/* BUTTONS */}
        <div className="grid sm:grid-cols-2 gap-3 mt-8">

          <Link
            href={orderId ? `/checkout?order=${orderId}` : "/checkout"}
            className="bg-[#004A90] text-white py-3 px-4 rounded-xl font-semibold hover:bg-[#00366B] transition"
          >
            Try Again
          </Link>

          <Link
            href="/shop"
            className="border border-gray-300 text-gray-700 py-3 px-4 rounded-xl font-semibold hover:bg-gray-50 transition"
          >
            Continue Shopping
          </Link>

        </div>

        {/* TRACK ORDER */}
        {orderId && (
          <Link
            href={`/track-order?order=${orderId}`}
            className="inline-block mt-5 text-[#004A90] font-medium hover:underline"
          >
            Track Order
          </Link>
        )}

      </div>
    </section>
  );
}

export default Page;

