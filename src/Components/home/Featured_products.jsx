"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

import { getProducts } from "../../Services/Product_Services";
import { useCart } from "../../context/CartContext";

function Featured_products() {
  const { addToCart } = useCart();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  //fetch Products using sperate Service component
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await getProducts();
      if(response.success){
        setProducts(response.products || []);
      }
    } catch (error) {
      console.error("Featured products  error", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const ProductSkeleton = () => {
    return (
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden animate-pulse">
        {/* Image Skeleton */}
        <div className="aspect-square bg-gray-200" />

        {/* Content Skeleton */}
        <div className="p-4">
          <div className="h-3 bg-gray-200 rounded w-1/3 mb-3" />

          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />

          <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />

          <div className="h-3 bg-gray-200 rounded w-1/3 mb-4" />

          <div className="flex items-center justify-between">
            <div className="h-5 bg-gray-200 rounded w-20" />

            <div className="w-9 h-9 bg-gray-200 rounded-lg" />
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg sm:text-xl font-extrabold text-gray-800">
          Featured <span className="text-[#0055B3]">Products</span>
        </h2>

        <Link
          href="/shop"
          className="text-sm font-bold text-[#0055B3] flex items-center gap-1 hover:gap-2 transition-all"
        >
          See all
          <span className="text-xs">→</span>
        </Link>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
        {loading
          ? Array.from({ length: 8 }).map((_, index) => (
              <ProductSkeleton key={index} />
            ))
          : products.slice(0, 8).map((product) => (
              <div
                key={product._id}
                className="group bg-white rounded-xl border border-gray-100 hover:shadow-lg transition overflow-hidden flex flex-col"
              >
                <Link href={`/products/${product.slug}`}>
                  {/* Image */}
                  <div className="relative aspect-square bg-gray-50 overflow-hidden">
                    <Image
                      src={
                        product.thumbnail
                          ? `/image/products/${product.thumbnail}`
                          : "/image/products/mobile_1.jpg"
                      }
                      alt={product.name || "Product"}
                      width={300}
                      height={300}
                      className="object-cover"
                    />
                    {/* Discount */}
                    {product.discountPrice > 0 &&
                      product.discountPrice < product.price && (
                        <span className="absolute top-2 left-2 bg-red-500 text-white text-[11px] font-bold px-2 py-0.5 rounded">
                          -
                          {Math.round(
                            ((product.price - product.discountPrice) /
                              product.price) *
                              100,
                          )}
                          %
                        </span>
                      )}

                    {/* Wishlist */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      aria-label="Add Galaxy A35 5G to wishlist"
                      className="absolute top-2 right-2 w-8 h-8 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-500 transition"
                    >
                      <i className="fa-regular fa-heart"></i>
                    </button>
                  </div>

                  {/* product details */}
                  <div className="p-4 flex flex-col flex-1">
                    <p className="text-[11px] uppercase text-gray-400 font-semibold">
                      {product.category_id?.name ||
                        product.category_id ||
                        "product"}
                    </p>
                    {/* Name */}
                    <h3 className="text-sm font-semibold text-gray-800 mt-1 flex-1">
                      {product.name || "Galaxy A35 5G 128GB"}
                    </h3>
                    {/* Rating */}
                    <div className="flex items-center gap-1 text-[12px] text-gray-400 mt-2">
                      <span className="text-amber-400">★★★★★</span>
                      4.8 <span>(214)</span>
                    </div>

                    {/* price */}
                    <div className="flex items-center justify-between gap-5 mt-3">
                      <div>
                        <span className="text-base font-extrabold text-[#002D62]">
                          Rs.
                          {(product.discountPrice > 0
                            ? product.discountPrice
                            : product.price
                          ).toLocaleString()}
                        </span>

                        {product.discountPrice > 0 &&
                          product.discountPrice < product.price && (
                            <span className="text-xs text-gray-400 line-through ml-1">
                              Rs. {product.price.toLocaleString()}
                            </span>
                          )}
                      </div>
                      {/* Add to Cart */}
                      <div className="w-full px-2  mt-auto">
                        <button
                          type="button"
                          aria-label="Add product to cart"
                          onClick={() => addToCart(product)}
                          disabled={product.stock <= 0}
                          className="w-full h-10 rounded-lg bg-[#002D62] text-white text-sm font-semibold flex items-center justify-center gap-2 hover:bg-[#0055B3] active:scale-[0.98] transition disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                          <i className="fa-solid fa-cart-plus"></i>

                          {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
                        </button>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
      </div>
    </section>
  );
}

export default Featured_products;
