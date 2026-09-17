"use client";

import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { searchProducts } from "../../../Services/Product_Services";
import { toast } from "react-toastify";
import Image from "next/image";
import Link from "next/link";

function SearchContent() {
  const searchParams = useSearchParams();

  const query = searchParams.get("q") || "";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSearchProducts = async () => {
    try {
      setLoading(true);

      if (!query.trim()) {
        setProducts([]);
        return;
      }

      const response = await searchProducts(query);

      if (response?.success) {
        setProducts(response.products || []);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error("Search error:", error);
      toast.error("Failed to search products");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSearchProducts();
  }, [query]);

  return (
    <section className="w-full px-4 sm:px-6 lg:px-10 py-10">

      {/* Heading */}
      <div className="mb-8">
        {query ? (
          <>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              Search results for &quot;{query}&quot;
            </h1>

            {!loading && (
              <p className="text-gray-500 mt-2">
                {products.length} product
                {products.length !== 1 ? "s" : ""} found
              </p>
            )}
          </>
        ) : (
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Search Products
          </h1>
        )}
      </div>

      {/* Loading */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border overflow-hidden animate-pulse"
            >
              <div className="aspect-square bg-gray-200" />

              <div className="p-4">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-3" />

                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />

                <div className="h-6 bg-gray-200 rounded w-1/3" />
              </div>
            </div>
          ))}
        </div>
      ) : products.length > 0 ? (

        /* Products */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => {
            const finalPrice =
              product.discountPrice > 0
                ? product.discountPrice
                : product.price;

            return (
              <Link
                href={`/shop/${product._id}`}
                key={product._id}
                className="bg-white rounded-xl border overflow-hidden hover:shadow-lg transition"
              >
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={
                      product.thumbnail?.startsWith("http")
                        ? "/image/products/shoes_1.jpg"
                        : product.thumbnail ||
                          "/image/products/shoes_1.jpg"
                    }
                    alt={product.name || "Product"}
                    fill
                    sizes="(max-width: 640px) 100vw,
                           (max-width: 768px) 50vw,
                           (max-width: 1024px) 33vw,
                           25vw"
                    className="object-cover hover:scale-105 transition duration-500"
                  />
                </div>

                <div className="p-4">
                  <h2 className="font-semibold text-gray-800 line-clamp-2">
                    {product.name}
                  </h2>

                  <div className="mt-3">
                    <span className="text-lg font-bold text-[#004A90]">
                      Rs. {finalPrice.toLocaleString()}
                    </span>

                    {product.discountPrice > 0 &&
                      product.discountPrice < product.price && (
                        <span className="ml-2 text-sm text-gray-400 line-through">
                          Rs. {product.price.toLocaleString()}
                        </span>
                      )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (

        /* No products */
        <div className="text-center py-20">
          <h2 className="text-xl font-semibold text-gray-700">
            No products found
          </h2>

          <p className="text-gray-500 mt-2">
            Try searching with a different product name.
          </p>
        </div>
      )}
    </section>
  );
}

export default SearchContent;