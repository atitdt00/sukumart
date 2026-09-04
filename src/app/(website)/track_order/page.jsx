import React from "react";

function page() {
  return (
    <>
      {/* TRACK ORDER PAGE  */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-display font-extrabold text-gray-800">
            Track <span className="text-[#0055B3]">Your Order</span>
          </h1>
          <p className="text-gray-500 mt-2 text-sm">
            Enter your order ID to check delivery status
          </p>
        </div>

        <div className="max-w-xl mx-auto bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm">
          <form className="space-y-4">
            <input
              type="text"
              placeholder="Enter Order ID (e.g. SUK123456)"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0055B3]"
            />

            <button
              type="submit"
              className="w-full bg-[#002D62] text-white py-3 rounded-lg font-semibold hover:bg-[#0055B3] transition"
            >
              Track Order
            </button>
          </form>

          {/* Sample status UI */}
          <div className="mt-8 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Order Placed</span>
              <span className="text-green-600 font-semibold">✔ Completed</span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Processing</span>
              <span className="text-yellow-600 font-semibold">
                ⏳ In Progress
              </span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Shipped</span>
              <span className="text-gray-400">Pending</span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Delivered</span>
              <span className="text-gray-400">Pending</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default page;
