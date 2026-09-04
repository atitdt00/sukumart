import Link from "next/link";
import React from "react";

export default function Top_Header() {
  return (
    <>
      {/* TOP BAR */}
      <div className="bg-[#002D62] text-white">
        <div className="max-w-7xl mx-auto px-6 h-[38px] flex items-center justify-between text-[12.5px] font-medium relative">
          <div className="flex items-center gap-5">
            <Link
              href="contact.html"
              className="flex items-center gap-1.5 text-white/70 hover:text-[#F4C542] transition-colors no-underline"
            >
              <i className="fa-solid fa-phone text-[11px]"></i> 9800000000
            </Link>
            <Link
              href="contact.html"
              className="hidden sm:flex items-center gap-1.5 text-white/70 hover:text-[#F4C542] transition-colors no-underline"
            >
              <i className="fa-regular fa-envelope text-[11px]"></i>{" "}
              support@sukumart.com
            </Link>
          </div>
          <p className="hidden lg:block absolute left-1/2 -translate-x-1/2 text-[11px] text-white/45 uppercase tracking-widest whitespace-nowrap">
            Quick · Simple · Trusted Shopping
          </p>
          <div className="flex items-center gap-3.5">
            <Link
              href="#"
              className="text-white/55 text-[13px] hover:text-[#F4C542] transition-colors no-underline"
            >
              <i className="fab fa-facebook-f"></i>
            </Link>
            <Link
              href="#"
              className="text-white/55 text-[13px] hover:text-[#F4C542] transition-colors no-underline"
            >
              <i className="fab fa-instagram"></i>
            </Link>
            <Link
              href="#"
              className="text-white/55 text-[13px] hover:text-[#F4C542] transition-colors no-underline"
            >
              <i className="fab fa-x-twitter"></i>
            </Link>
            <Link
              href="#"
              className="text-white/55 text-[13px] hover:text-[#F4C542] transition-colors no-underline"
            >
              <i className="fab fa-tiktok"></i>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
