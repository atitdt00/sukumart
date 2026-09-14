import Image from "next/image";
import Link from "next/link";
import React from "react";

function page() {
  return (
    <>
      {/* <!-- ── ABOUT PAGE CONTENT ── --> */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-display font-extrabold text-gray-800">
            About <span className="text-[#0055B3]">SukuMart</span>
          </h1>
          <p className="text-gray-500 mt-2 text-sm md:text-base">
            Quick · Simple · Trusted Shopping Experience
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* <!-- Text --> */}
          <div className="space-y-5">
            <h2 className="text-xl font-bold text-gray-800">
              Your Trusted Online Marketplace in Nepal
            </h2>

            <p className="text-gray-600 text-sm leading-relaxed">
              SukuMart is Link modern e-commerce platform designed to bring
              electronics, fashion, groceries, and daily essentials together in
              one place. We focus on fast delivery, trusted sellers, and Link
              seamless shopping experience.
            </p>

            <p className="text-gray-600 text-sm leading-relaxed">
              Our mission is to make online shopping simple, affordable, and
              accessible for everyone in Nepal.
            </p>

            <div className="flex gap-3 pt-2">
              <Link
                href="/shop"
                className="px-4 py-2 bg-[#002D62] text-white rounded-lg text-sm hover:bg-[#0055B3] transition"
              >
                Start Shopping
              </Link>
              <Link
                href="/contact"
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:border-[#0055B3] hover:text-[#0055B3] transition"
              >
                Contact Us
              </Link>
            </div>
          </div>

          {/* <!-- Image / Card --> */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <Image
              src={"/image/products/mobile_1.jpg"}
              className="rounded-xl mb-4"
              alt="Shopping"
              // sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              width={128}
              height={128}
            />

            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-4 bg-gray-50 rounded-xl">
                <h3 className="text-xl font-bold text-[#002D62]">10K+</h3>
                <p className="text-xs text-gray-500">Products</p>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl">
                <h3 className="text-xl font-bold text-[#002D62]">5K+</h3>
                <p className="text-xs text-gray-500">Customers</p>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl">
                <h3 className="text-xl font-bold text-[#002D62]">24/7</h3>
                <p className="text-xs text-gray-500">Support</p>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl">
                <h3 className="text-xl font-bold text-[#002D62]">Fast</h3>
                <p className="text-xs text-gray-500">Delivery</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default page;
