
"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { getCategories } from "../../../Services/Category_Service";

function Page() {
  const [view, setView] = useState("grid");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const data = await getCategories();


      // Your API returns { success: true, categories: [...] }
      setCategories(data || []);
    } catch (error) {
      console.error("Category API error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <>
      {/* PAGE HERO */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 pb-8">
        <div className="bg-gradient-to-r from-[#002D62] to-[#0055B3] rounded-2xl px-6 sm:px-10 py-8 sm:py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 relative overflow-hidden">

          {/* Decorative rings */}
          <div className="absolute -right-10 -top-10 w-64 h-64 rounded-full border-[40px] border-white/5 pointer-events-none" />

          <div className="absolute -right-4 top-10 w-40 h-40 rounded-full border-[24px] border-white/5 pointer-events-none" />

          <div>
            <p className="text-[#F4C542] text-[11px] font-bold uppercase tracking-widest mb-1.5">
              Explore
            </p>

            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white leading-tight">
              Shop by Category
            </h1>

            <p className="text-white/60 text-sm mt-1.5 max-w-md">
              Browse our full range of products across electronics, fashion,
              home, health, and more.
            </p>
          </div>

          <div className="flex items-center gap-3 text-sm font-semibold text-white/80 bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 shrink-0">
            <i className="fa-solid fa-layer-group text-[#F4C542]" />

            {categories.length} categories
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">

        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
              All Categories
            </h2>

            <p className="text-gray-400 text-sm mt-0.5">
              Find exactly what you need
            </p>
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-1">

            <button
              onClick={() => setView("grid")}
              className={`flex items-center justify-center w-8 h-8 rounded-md text-sm transition-all ${
                view === "grid"
                  ? "bg-[#002D62] text-white"
                  : "text-gray-400 hover:bg-gray-100"
              }`}
            >
              <i className="fa-solid fa-grip" />
            </button>

            <button
              onClick={() => setView("list")}
              className={`flex items-center justify-center w-8 h-8 rounded-md text-sm transition-all ${
                view === "list"
                  ? "bg-[#002D62] text-white"
                  : "text-gray-400 hover:bg-gray-100"
              }`}
            >
              <i className="fa-solid fa-list" />
            </button>

          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="py-20 text-center text-gray-400">
            Loading categories...
          </div>
        )}

        {/* No Categories */}
        {!loading && categories.length === 0 && (
          <div className="py-20 text-center text-gray-400">
            No categories found.
          </div>
        )}

        {/* Categories */}
        {!loading && categories.length > 0 && (
          <div
            className={
              view === "grid"
                ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-5"
                : "flex flex-col gap-4"
            }
          >
            {categories.map((category) => (
              <Link
                key={category._id}
                href={`/categories/${category.slug}`}
                className={
                  view === "grid"
                    ? "group relative bg-white border border-gray-100 rounded-2xl p-5 sm:p-6 no-underline flex flex-col gap-4 hover:border-blue-200 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 overflow-hidden"
                    : "group relative bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-5 hover:border-blue-200 hover:shadow-lg transition-all duration-200"
                }
              >

                {/* Decorative Circle */}
                <div className="absolute top-0 right-0 w-28 h-28 rounded-full bg-blue-50 -translate-y-10 translate-x-10 group-hover:bg-blue-100 transition-colors" />

                {/* Category Icon/Image */}
                <div
                  className={
                    view === "grid"
                      ? "relative w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 text-xl overflow-hidden"
                      : "relative w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 text-xl overflow-hidden shrink-0"
                  }
                >
                  {category.image ? ( 
                    <Image
                      src={category.image}
                      alt={category.name}
                      width={200}
                      height={200}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <i className="fa-solid fa-layer-group" />
                  )}
                </div>

                {/* Category Information */}
                <div className="flex-1 relative">

                  <h3 className="font-bold text-gray-800 text-base leading-tight group-hover:text-[#002D62] transition-colors">
                    {category.name}
                  </h3>

                  {category.parent_id && (
                    <p className="text-gray-400 text-xs mt-1">
                      {category.parent_id.name}
                    </p>
                  )}

                  <p className="text-gray-400 text-xs mt-1">
                    Explore {category.name}
                  </p>

                </div>

                {/* Arrow */}
                <div className="relative flex items-center justify-between">

                  <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                    View products
                  </span>

                  <i className="fa-solid fa-arrow-right ml-3 text-[11px] text-gray-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />

                </div>

              </Link>
            ))}
          </div>
        )}

        {/* PROMO BANNER */}
        <div className="mt-10 bg-[#F4C542] rounded-2xl px-6 sm:px-10 py-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative overflow-hidden">

          <div className="absolute -left-6 -bottom-6 w-32 h-32 rounded-full bg-black/5 pointer-events-none" />

          <div>
            <p className="text-[#002D62] font-extrabold text-lg sm:text-xl font-display leading-tight">
              New to SukuMart?
            </p>

            <p className="text-[#002D62]/70 text-sm mt-1">
              Sign up and get{" "}
              <strong className="text-[#002D62]">
                15% off
              </strong>{" "}
              your first order across all categories.
            </p>
          </div>

          <Link
            href="/sign-up"
            className="shrink-0 inline-flex items-center gap-2 bg-[#002D62] text-white text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-[#003D84] transition-colors no-underline"
          >
            Create Account
            <i className="fa-solid fa-arrow-right text-xs" />
          </Link>

        </div>
      </div>
    </>
  );
}

export default Page;

