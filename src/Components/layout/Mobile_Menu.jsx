import Link from "next/link";
import React from "react";

function Mobile_Menu() {
  return (
    <>
      {/* <!-- ── MOBILE MENU ── --> */}
      <div
        id="mobileMenu"
        className="hidden lg:hidden bg-white border-b border-gray-100 shadow-lg z-40 relative"
      >
        <div className="flex items-center gap-2 mx-4 my-3 px-4 py-2.5 bg-amber-50 border border-amber-200 rounded-xl text-[13px] font-bold text-amber-700">
          <i className="fa-solid fa-bolt text-amber-500"></i> Flash Sale — Up to 60%
          Off!
        </div>
        <nav className="flex flex-col">
          <Link
            href="/"
            className="flex items-center justify-between px-5 py-3.5 text-sm font-semibold text-gray-800 border-b border-gray-100 hover:bg-gray-50 hover:text-[#002D62] no-underline transition-colors"
          >
            Home{" "}
            <i className="fa-solid fa-chevron-right text-[11px] text-gray-300"></i>
          </Link>
          <Link
            href="/categories"
            className="flex items-center justify-between px-5 py-3.5 text-sm font-semibold text-gray-800 border-b border-gray-100 hover:bg-gray-50 hover:text-[#002D62] no-underline transition-colors"
          >
            Categories{" "}
            <i className="fa-solid fa-chevron-right text-[11px] text-gray-300"></i>
          </Link>
          <Link
            href="/shop"
            className="flex items-center justify-between px-5 py-3.5 text-sm font-semibold text-gray-800 border-b border-gray-100 hover:bg-gray-50 hover:text-[#002D62] no-underline transition-colors"
          >
            Shop{" "}
            <i className="fa-solid fa-chevron-right text-[11px] text-gray-300"></i>
          </Link>
          <Link
            href="/deals"
            className="flex items-center justify-between px-5 py-3.5 text-sm font-semibold text-[#E53935] border-b border-gray-100 hover:bg-red-50 no-underline transition-colors"
          >
            <span>
              Deals{" "}
              <span className="ml-2 bg-[#E53935] text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wide">
                HOT
              </span>
            </span>
            <i className="fa-solid fa-chevron-right text-[11px] text-gray-300"></i>
          </Link>
          <Link
            href="track-order.html"
            className="flex items-center justify-between px-5 py-3.5 text-sm font-semibold text-gray-800 border-b border-gray-100 hover:bg-gray-50 hover:text-[#002D62] no-underline transition-colors"
          >
            Track Order{" "}
            <i className="fa-solid fa-chevron-right text-[11px] text-gray-300"></i>
          </Link>
          <Link
            href="/about"
            className="flex items-center justify-between px-5 py-3.5 text-sm font-semibold text-gray-800 border-b border-gray-100 hover:bg-gray-50 hover:text-[#002D62] no-underline transition-colors"
          >
            About{" "}
            <i className="fa-solid fa-chevron-right text-[11px] text-gray-300"></i>
          </Link>
          <Link
            href="/contact"
            className="flex items-center justify-between px-5 py-3.5 text-sm font-semibold text-gray-800 hover:bg-gray-50 hover:text-[#002D62] no-underline transition-colors"
          >
            Contact{" "}
            <i className="fa-solid fa-chevron-right text-[11px] text-gray-300"></i>
          </Link>
        </nav>
      </div>
    </>
  );
}

export default Mobile_Menu;
