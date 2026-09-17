import Link from "next/link";
import React from "react";

function Footer() {
  return (
    <>
      <footer className="bg-gradient-to-b from-[#002D62] to-[#001A3A] text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          {/* <!-- TOP GRID --> */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
            {/* <!-- BRAND --> */}
            <div className="space-y-4">
              <h2 className="text-2xl font-extrabold tracking-wide">
                Suku<span className="text-[#4DA3FF]">Mart</span>
              </h2>

              <p className="text-sm text-gray-300 leading-relaxed">
                Your one-stop online shopping destination for electronics,
                fashion, and daily essentials with best deals and fast delivery.
              </p>

              {/* <!-- ADDRESS --> */}
              <div className="text-sm text-gray-300 space-y-1">
                <p className="font-semibold text-white">Our Address</p>
                <p>SukuMart Pvt. Ltd.</p>
                <p>Kathmandu, Nepal</p>
                <p>Email: support@sukumamart.com</p>
                <p>Phone: +977-98XXXXXXXX</p>
              </div>

              {/* <!-- SOCIAL --> */}
              <div className="flex gap-3 pt-2">
                <Link
                  href="#"
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-[#004A90] transition"
                >
                  <i className="fa-brands fa-facebook-f"></i>
                </Link>
                <Link
                  href="#"
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-[#004A90] transition"
                >
                  <i className="fa-brands fa-instagram"></i>
                </Link>
                <Link
                  href="#"
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-[#004A90] transition"
                >
                  <i className="fa-brands fa-x-twitter"></i>
                </Link>
                <Link
                  href="#"
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-[#004A90] transition"
                >
                  <i className="fa-brands fa-youtube"></i>
                </Link>
              </div>
            </div>

            {/* <!-- QUICK LINKS --> */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider mb-4">
                Quick Links
              </h3>
              <ul className="space-y-3 text-sm text-gray-300">
                <li>
                  <Link
                    href="/"
                    className="hover:text-white hover:pl-1 transition"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/shop"
                    className="hover:text-white hover:pl-1 transition"
                  >
                    Shop
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="hover:text-white hover:pl-1 transition"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="hover:text-white hover:pl-1 transition"
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white hover:pl-1 transition">
                    FAQs
                  </Link>
                </li>
              </ul>
            </div>

            {/* <!-- CATEGORIES --> */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider mb-4">
                Categories
              </h3>
              <ul className="space-y-3 text-sm text-gray-300">
                <li>
                  <Link
                    href="/categories"
                    className="hover:text-white hover:pl-1 transition"
                  >
                    Electronics
                  </Link>
                </li>
                <li>
                  <Link
                    href="/categories"
                    className="hover:text-white hover:pl-1 transition"
                  >
                    Fashion
                  </Link>
                </li>
                <li>
                  <Link
                    href="/categories"
                    className="hover:text-white hover:pl-1 transition"
                  >
                    Home & Living
                  </Link>
                </li>
                <li>
                  <Link
                    href="/categories"
                    className="hover:text-white hover:pl-1 transition"
                  >
                    Sports
                  </Link>
                </li>
                <li>
                  <Link
                    href="/categories"
                    className="hover:text-white hover:pl-1 transition"
                  >
                    Books
                  </Link>
                </li>
              </ul>
            </div>

            {/* <!-- NEWSLETTER --> */}
            <div className="sm:col-span-2 lg:col-span-1">
              <h3 className="text-sm font-bold uppercase tracking-wider mb-4">
                Newsletter
              </h3>

              <p className="text-sm text-gray-300 mb-4">
                Get updates, offers & discounts directly in your inbox.
              </p>

              <form className="space-y-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full text-white px-4 py-2 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-[#4DA3FF]"
                />

                <button className="w-full bg-[#004A90] hover:bg-[#F4C542] transition py-2 rounded-md font-semibold">
                  Subscribe
                </button>
              </form>
            </div>

            {/* <!-- SUPPORT --> */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider mb-4">
                Support
              </h3>
              <ul className="space-y-3 text-sm text-gray-300">
                <li>
                  <Link href="#" className="hover:text-white hover:pl-1 transition">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white hover:pl-1 transition">
                    Shipping Info
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white hover:pl-1 transition">
                    Returns
                  </Link>
                </li>
                <li>
                  <Link href="/track_order" className="hover:text-white hover:pl-1 transition">
                    Order Tracking
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* <!-- DIVIDER --> */}
          <div className="border-t border-white/10 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400 gap-4">
            <p className="text-center md:text-left">
              © 2026 SukumaMart. All rights reserved.
            </p>

            <div className="flex flex-wrap justify-center gap-5">
              <Link href="#" className="hover:text-white transition">
                Privacy Policy
              </Link>
              <Link href="#" className="hover:text-white transition">
                Terms
              </Link>
              <Link href="#" className="hover:text-white transition">
                Support
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Footer;
