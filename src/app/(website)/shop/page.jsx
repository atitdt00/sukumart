"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { getCategories } from "../../../Services/Category_Service";
import { getProducts } from "../../../Services/Product_Services";
import { toast } from "react-toastify";
import { useCart } from "../../../context/CartContext";
import Link from "next/link";

function page() {
  const { addToCart } = useCart();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  //fetch categories
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await getCategories();
      setCategories(response.categories);
    } catch (error) {
      console.error("Category Api error", error);
    } finally {
      setLoading(false);
    }
  };

  //get products
  const fetchProducts = async () => {
    try {
      const response = await getProducts();
      if (!response) {
        toast.error("There are no products");
        return;
      }
      setProducts(response.products);
    } catch (error) {
      console.error(error);
    }
  };

  const filteredProducts = products.filter((product) => 
        product.isSale === true).filter((product)=> {
          if(!selectedCategory) return true;
        

        const categoryId =
          typeof product.category_id === "object"
            ? product.category_id._id
            : product.category_id;

        return categoryId === selectedCategory;
      });
   

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);
  return (
    <>
      {/* <!-- MAIN CONTENT --> */}

      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* <!-- SIDEBAR --> */}
          <aside className="lg:block">
            <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-28">
              <h2 className="font-bold text-xl mb-5">Categories</h2>

              <div className="space-y-3">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`block w-full text-left mb-4 cursor-pointer ${
                    selectedCategory === null
                      ? "text-[#004A90] font-bold"
                      : "hover:text-[#004A90]"
                  }`}
                >
                  All Categories
                </button>
                {loading ? (
                  <p className="text-gray-500">Loading categories...</p>
                ) : categories.length === 0 ? (
                  <p className="text-gray-500">No categories found.</p>
                ) : (
                  categories.map((category) => (
                    <button
                      key={category._id}
                      onClick={() => setSelectedCategory(category._id)}
                      className={`block w-full text-left hover:text-[#004A90] cursor-pointer ${
                        selectedCategory === category._id
                          ? "text-[#004A90] font-bold"
                          : ""
                      }`}
                    >
                      {category.name}
                    </button>
                  ))
                )}
              </div>
            </div>
          </aside>

          {/* <!-- PRODUCTS --> */}
          <div className="lg:col-span-3">
            {/* <!-- TOP BAR --> */}
            <div className="bg-white rounded-2xl p-4 shadow-sm mb-8 flex flex-col md:flex-row gap-4 justify-between">
              <input
                type="text"
                placeholder="Search products..."
                className="border rounded-xl px-4 py-3 w-full md:w-96"
              />

              <select className="border rounded-xl px-4 py-3">
                <option>Sort By</option>
                <option>Newest</option>
                <option>Price Low to High</option>
                <option>Price High to Low</option>
              </select>
            </div>

            {/* <!-- SALE BANNER --> */}
            <div className="bg-gradient-to-r from-[#004A90] to-[#002D62] rounded-3xl p-8 text-white mb-8">
              <h2 className="text-3xl font-bold">Summer Mega Sale</h2>

              <p className="mt-2 text-blue-100">
                Up to 50% OFF on selected products.
              </p>
            </div>

            {/* <!-- PRODUCT GRID --> */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {/* <!-- CARD --> */}
              {filteredProducts.length > 0 ? (
                filteredProducts.slice(0, 9).map((product) => (
                  <div
                    key={product._id}
                    className="bg-white rounded-2xl overflow-hidden border hover:shadow-xl transition"
                  >
                    <Link href={`/products/${product.slug}`}>
                      <div className="relative overflow-hidden">
                        <Image
                          src={
                            product.thumbnail
                              ? `/image/products/${product.thumbnail}`
                              : "/image/products/sukumartlogo.jpg"
                          }
                          className="w-full h-64 object-fit hover:scale-105 transition duration-500"
                          alt={product.name || "product"}
                          // fill
                          // sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                          width={200}
                          height={220}
                        />

                        <span className="absolute top-3 left-3 bg-red-500 text-white text-xs px-3 py-1 rounded-full">
                          SALE
                        </span>
                      </div>

                      <div className="p-5">
                        <h3 className="font-bold text-lg">{product.name}</h3>

                        <div className="text-yellow-400 mt-2">
                          ★★★★★
                          <span className="text-gray-500 text-sm">(120)</span>
                        </div>

                        <p className="text-gray-500 text-sm mt-3">
                          {product.description || "Lightweight and comfortable"}
                        </p>

                        <div className="flex justify-between items-center mt-5">
                          <div>
                            {product.discountPrice > 0 &&
                            product.discountPrice < product.price ? (
                              <>
                                {/* Discount Price */}
                                <span className="text-xl font-bold text-[#004A90]">
                                  Rs. {product.discountPrice.toLocaleString()}
                                </span>

                                {/* Original Price */}
                                <span className="text-gray-400 line-through ml-2 text-sm">
                                  Rs. {product.price.toLocaleString()}
                                </span>

                                {/* Discount Percentage */}
                                <span className="block text-xs text-red-500 mt-1">
                                  {Math.round(
                                    ((product.price - product.discountPrice) /
                                      product.price) *
                                      100,
                                  )}
                                  % OFF
                                </span>
                              </>
                            ) : (
                              <span className="text-xl font-bold text-[#004A90]">
                                Rs. {product.price.toLocaleString()}
                              </span>
                            )}
                          </div>

                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();  
                              addToCart(product)}}
                            className="bg-[#004A90] text-white px-4 py-2 rounded-xl hover:bg-[#0055B3] active:scale-[0.98] transition disabled:bg-gray-300 disabled:cursor-not-allowed"
                          >
                            Add Cart
                          </button>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))
              ) : (
                <div className="col-span-full  text-center py-10 text-gray-500">
                  No Products found in this Category
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default page;
