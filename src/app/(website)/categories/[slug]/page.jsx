"use client";

import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { getCategoryBySlug } from "../../../../Services/Category_Service.js";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "../../../../context/CartContext.jsx";

function page() {
  const { addToCart } = useCart();
  const params = useParams();

  const [selectedImage, setSelectedImage] = useState(null);
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        const data = await getCategoryBySlug(params.slug);
        setCategory(data.category);
        setProducts(data.products || []);
      } catch (error) {
        console.error("Category products error:", error);
      }
    };

    if (params.slug) {
      fetchCategoryProducts();
    }
  }, [params.slug]);

  if (!category) {
    return <div className="max-w-7xl mx-auto px-6 py-20">Loading...</div>;
  }

  return (
    <div>
      <section className="max-w-7xl mx-auto px-6 py-10">
        {/* Category title */}

        <div className="mb-8">
          <Link href="/categories" className="text-sm text-[#0055B3]">
            ← All Categories
          </Link>

          <h1 className="text-3xl font-bold text-gray-800 mt-3">
            {category.name}
          </h1>

          <p className="text-gray-400 mt-1">{products.length} products</p>
        </div>

        {/* Products */}

        {products.length === 0 ? (
          <div className="py-20 text-center text-gray-400">
            No products found in this category.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg transition"
              >
                <Link href={`/products/${product.slug}`}>
                  {/*product Gallery */}
                  <div>
                    {/* Main Gallery */}
                    <div className="relative aspect-square bg-gray-100 rounded-2xl overflow-hidden">
                      <Image
                        src={
                          product.thumbnail
                            ? `/image/products/${product.thumbnail}`
                            : "/image/products/sukumartlogo.jpg"
                        }
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>

                  <div className="p-4">
                    <p className="text-xs text-gray-400 uppercase">
                      {category.name}
                    </p>

                    <h2 className="font-semibold text-gray-800 mt-1">
                      {product.name}
                    </h2>

                    <div className="flex items-center justify-between mt-3">
                      <div>
                        {product.discountPrice > 0 ? (
                          <>
                            <span className="font-bold text-[#002D62]">
                              Rs. {product.discountPrice.toLocaleString()}
                            </span>

                            <span className="ml-2 text-xs text-gray-400 line-through">
                              Rs. {product.price.toLocaleString()}
                            </span>
                          </>
                        ) : (
                          <span className="font-bold text-[#002D62]">
                            Rs. {product.price.toLocaleString()}
                          </span>
                        )}
                      </div>

                      {/* Add to Cart */}
                      <button
                        type="button"
                        aria-label="Add product to cart"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          addToCart(product);
                        }}
                        className="w-9 h-9 rounded-lg bg-[#002D62] text-white flex items-center justify-center hover:bg-[#0055B3] transition"
                      >
                        <i className="fa-solid fa-plus"></i>
                      </button>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default page;
