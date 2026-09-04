import Link from "next/link";
import React from "react";

function HeroSection() {
  return (
    <>
      {/* <!-- ── HERO ── -->  */}
      <section className="max-w-7xl mx-auto px-6 mt-8 mb-6 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-5">
        <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-[#002D62] to-[#0055B3] p-8 md:p-14 min-h-[300px] md:min-h-[340px] flex flex-col justify-end">
          <div className="absolute -top-16 -right-16 w-72 h-72 bg-white/5 rounded-full pointer-events-none"></div>
          <div className="absolute top-10 right-20 w-40 h-40 bg-white/[0.03] rounded-full pointer-events-none"></div>
          <div className="inline-flex items-center gap-1.5 bg-amber-400/15 border border-amber-400/35 text-[#F4C542] text-[11px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-4 w-fit">
            <i className="fa-solid fa-bolt text-[10px]"></i> New Season Arrivals
          </div>
          <h1 className="font-display text-3xl md:text-5xl font-extrabold text-white leading-[1.1] mb-3">
            Shop Smarter,
            <br />
            Save <span className="text-[#F4C542]">More Today</span>
          </h1>
          <p className="text-white/65 text-[15px] leading-relaxed max-w-md mb-7">
            Discover thousands of products with fast delivery, secure payments,
            and Link trusted shopping experience you&apos;ll love.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="#"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#F4C542] text-[#002D62] text-sm font-bold rounded-xl hover:bg-yellow-300 transition-all hover:-translate-y-0.5 no-underline"
            >
              <i className="fa-solid fa-bag-shopping"></i> Shop Now
            </Link>
            <Link
              href="#"
              className="inline-flex items-center gap-2 px-6 py-3 text-white text-sm font-semibold border-[1.5px] border-white/30 rounded-xl hover:border-white hover:bg-white/8 transition-all no-underline"
            >
              View Deals <i className="fa-solid fa-arrow-right text-xs"></i>
            </Link>
          </div>
        </div>
        <div className="hidden lg:flex flex-col gap-4">
          <div className="flex-1 relative overflow-hidden rounded-2xl p-6 flex flex-col justify-end min-h-[150px] bg-[linear-gradient(135deg,#0F2027,#203A43,#2C5364)]">
            <div className="text-[11px] font-bold uppercase tracking-widest text-white/50 mb-1">
              Electronics
            </div>
            <div className="font-display text-xl font-extrabold text-white leading-tight mb-2.5">
              Up to 40%
              <br />
              on Gadgets
            </div>
            <Link
              href="/shop"
              className="inline-flex items-center gap-1.5 text-[12.5px] font-bold text-[#F4C542] no-underline hover:gap-3 transition-all"
            >
              Shop now <i className="fa-solid fa-arrow-right text-[10px]"></i>
            </Link>
          </div>
          <div
            className="flex-1 relative overflow-hidden rounded-2xl p-6 flex flex-col justify-end min-h-[150px]"
            style={{background:"linear-gradient(135deg,#4A148C,#7B1FA2,#CE93D8)"}}
          >
            <div className="text-[11px] font-bold uppercase tracking-widest text-white/50 mb-1">
              Fashion Week
            </div>
            <div className="font-display text-xl font-extrabold text-white leading-tight mb-2.5">
              New Styles
              <br />
              Just In
            </div>
            <Link
              href="/shop"
              className="inline-flex items-center gap-1.5 text-[12.5px] font-bold text-[#F4C542] no-underline hover:gap-3 transition-all"
            >
              Explore <i className="fa-solid fa-arrow-right text-[10px]"></i>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default HeroSection;
