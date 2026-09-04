"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState, useRef } from "react";
import { getCategories } from "../../Services/Category_Service";
import { toast } from "react-toastify";
import { useModal } from "../../context/ModalContext";
import {  logoutUser } from "../../Services/Auth_Service";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";

function Header() {
  const { cart } = useCart();
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { openLogin, isLoginOpen } = useModal(); // Include modal state if available
const { user, setUser, authLoading}=useAuth();
  const categoryRef = useRef(null);

 

  // Handle Logout User
  const handleLogout = async () => {
    try {
      const response = await logoutUser();
      if (response?.success) {
        setUser(null);
        toast.success(response.message || "Logged out successfully");
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error(error.response?.data?.message || "Logout failed");
    }
  };

  // Fetch Categories
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await getCategories();
      setCategories(data || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  // Close Category Dropdown on Outside Click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (categoryRef.current && !categoryRef.current.contains(event.target)) {
        setIsCategoryOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Sync Auth state on mount and when modal closes
  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-5 h-[72px]">
          {/* Logo */}
          <Link href="/" className="shrink-0 no-underline">
            <Image
              src="/image/products/sukumart.jpg"
              alt="Sukumart"
              width={160}
              height={40}
              className="h-8 w-auto object-contain"
            />
          </Link>

          {/* Desktop Search */}
          <div className="hidden md:flex flex-1 max-w-2xl items-center h-12 bg-gray-50 border-[1.5px] border-gray-200 rounded-full overflow-visible transition-all duration-200 focus-within:border-[#0055B3] focus-within:ring-4 focus-within:ring-blue-500/10 focus-within:bg-white relative">
            {/* Category Dropdown */}
            <div ref={categoryRef} className="relative h-full shrink-0">
              <button
                type="button"
                onClick={() => setIsCategoryOpen((prev) => !prev)}
                disabled={loading}
                className="flex items-center gap-2 h-full pl-4 pr-3.5 text-[13px] font-semibold text-gray-600 border-r border-gray-200 bg-transparent hover:text-[#002D62] transition-colors whitespace-nowrap rounded-l-full select-none cursor-pointer"
                aria-haspopup="listbox"
                aria-expanded={isCategoryOpen}
              >
                <span>All Categories</span>
                <i
                  className={`fa-solid fa-angle-down text-[10px] text-gray-400 transition-transform duration-200 ${
                    isCategoryOpen ? "rotate-180" : ""
                  }`}
                ></i>
              </button>

              {isCategoryOpen && (
                <div className="absolute top-[calc(100%+8px)] left-0 w-56 bg-white border border-gray-200 rounded-2xl shadow-xl z-[100] p-1.5 overflow-hidden">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 px-3.5 pt-2 pb-1.5">
                    Categories
                  </p>

                  <div role="listbox" className="flex flex-col gap-0.5 max-h-60 overflow-y-auto">
                    {categories.map((category) => (
                      <Link
                        key={category._id}
                        href={`/categories/${category.slug}`}
                        onClick={() => setIsCategoryOpen(false)}
                        className="px-3.5 py-2 text-xs text-gray-700 hover:bg-blue-50 hover:text-[#002D62] rounded-lg transition-colors"
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Search Input */}
            <input
              type="text"
              placeholder="Search products..."
              className="flex-1 h-full px-4 bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400"
            />
            {/* Search Button */}
            <button
              type="button"
              className="flex items-center justify-center w-12 h-10 mr-1 rounded-full bg-[#002D62] text-white hover:bg-[#0055B3] transition-colors"
            >
              <i className="fa-solid fa-magnifying-glass"></i>
            </button>
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-2 ml-auto">
            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="flex items-center justify-center w-11 h-11 rounded-xl border-[1.5px] border-gray-200 text-gray-700 text-xl hover:border-[#0055B3] hover:text-[#002D62] transition-all no-underline"
            >
              <i className="fa-regular fa-heart"></i>
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative flex items-center justify-center w-11 h-11 rounded-xl border-[1.5px] border-gray-200 text-gray-700 text-xl hover:border-[#0055B3] hover:text-[#002D62] transition-all no-underline"
            >
              <i className="fa-solid fa-cart-shopping"></i>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#E53935] text-white text-[10px] font-bold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Auth Button (Logout / Account) */}
            {!authLoading && (
              user ? (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="hidden lg:flex items-center gap-2.5 h-11 px-4 rounded-xl border-[1.5px] border-red-200 text-red-600 hover:bg-red-50 transition-all cursor-pointer"
                >
                  <i className="fa-solid fa-right-from-bracket text-[17px]"></i>
                  <div className="flex flex-col items-start leading-none">
                    <span className="text-[11px] text-gray-400 font-normal">
                      Hello, {user.name || "User"}
                    </span>
                    <span className="text-[13px] font-bold mt-0.5">Logout</span>
                  </div>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={openLogin}
                  className="hidden lg:flex items-center gap-2.5 h-11 px-4 rounded-xl border-[1.5px] border-gray-200 text-gray-800 hover:border-[#0055B3] hover:text-[#002D62] hover:bg-blue-50/50 transition-all cursor-pointer"
                >
                  <i className="fa-regular fa-user text-[17px]"></i>
                  <div className="flex flex-col items-start leading-none">
                    <span className="text-[11px] text-gray-400 font-normal">
                      Hello,
                    </span>
                    <span className="text-[13px] font-bold mt-0.5">
                      My Account
                    </span>
                  </div>
                </button>
              )
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className="lg:hidden flex items-center justify-center w-11 h-11 rounded-xl border-[1.5px] border-gray-200 text-gray-700 text-xl hover:border-gray-300 transition-all"
            >
              <i className={`fa-solid ${isMenuOpen ? "fa-xmark" : "fa-bars"}`}></i>
            </button>
          </div>
        </div>

        {/* Mobile Search Input */}
        <div className="md:hidden pb-4">
          <div className="flex items-center h-11 bg-gray-50 border-[1.5px] border-gray-200 rounded-full overflow-hidden focus-within:border-[#0055B3] focus-within:ring-4 focus-within:ring-blue-500/10 px-4">
            <input
              type="text"
              placeholder="Search products…"
              className="flex-1 h-full bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400"
            />
            <button type="button" className="text-gray-500 hover:text-[#002D62]">
              <i className="fa-solid fa-magnifying-glass"></i>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-100 flex flex-col gap-3">
            {!authLoading && (
              user ? (
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center gap-3 w-full p-3 rounded-xl bg-red-50 text-red-600 font-medium text-sm"
                >
                  <i className="fa-solid fa-right-from-bracket"></i>
                  <span>Logout ({user.name})</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    openLogin();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center gap-3 w-full p-3 rounded-xl bg-gray-100 text-gray-800 font-medium text-sm"
                >
                  <i className="fa-regular fa-user"></i>
                  <span>My Account / Login</span>
                </button>
              )
            )}
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;