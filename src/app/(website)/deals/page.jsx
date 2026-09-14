"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getProducts } from "../../../Services/Product_Services";
import { useCart } from "../../../context/CartContext";

function page() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const { addToCart }=useCart()

  const fetchDeals = async () => {
    try {
      setLoading(true);

      const response = await getProducts();

      if (response.success) {
        const dealProducts = response.products.filter(
          (product) => product.isDeal === true,
        );
        setProducts(dealProducts);
      }
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message || "something went wrong on deals page",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeals();
  }, []);

  return (
    <>
      {/* <!-- HERO DEAL BANNER --> */}
      <section className="bg-gradient-to-r from-red-600 to-orange-500 text-white">
        <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">
              🔥 Hot Deals of the Day
            </h1>
            <p className="mt-2 text-white/90">
              Limited time offers — grab before they’re gone!
            </p>
          </div>

          {/* <!-- Countdown UI (static design) --> */}
          <div className="flex gap-3 text-center">
            <div className="bg-white text-red-600 px-4 py-2 rounded-lg">
              <div className="text-xl font-bold">12</div>
              <div className="text-xs">Hours</div>
            </div>
            <div className="bg-white text-red-600 px-4 py-2 rounded-lg">
              <div className="text-xl font-bold">45</div>
              <div className="text-xs">Min</div>
            </div>
            <div className="bg-white text-red-600 px-4 py-2 rounded-lg">
              <div className="text-xl font-bold">20</div>
              <div className="text-xs">Sec</div>
            </div>
          </div>
        </div>
      </section>

      {/* <!-- DEALS GRID --> */}
      <section className="max-w-7xl mx-auto px-6 py-10">
        {loading ? (
          <div className="text-center py-10 text-gray-500">
            Loading hot deal Products ......
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            No hot deals available
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* <!-- Deal Card --> */}

            {products.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition"
              >
                <div className="relative">
                  <Image
                    src={
                      product.thumbnail
                        ? `/image/products/${product.thumbnail}`
                        : `/image/products/sukumartlogo.jpg`
                    }
                    className="w-full  object-fit hover:scale-105 transition duration-500"
                    alt={product.name || "product"}
                    width={200}
                    height={200}
                  />

                  <span className="absolute top-3 left-3 bg-red-500 text-white text-xs px-3 py-1 rounded-full">
                    -30% Hot Deal
                  </span>
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <h3 className="font-semibold">{product.name}</h3>

                  <div className="flex items-center gap-1 text-yellow-400 text-sm mt-1">
                    ⭐⭐⭐⭐ <span className="text-gray-500">(4.2)</span>
                  </div>

                  <div className="mt-2 flex items-center justify-between">
                    <div>
                      <span className="text-red-500 font-bold">
                        Rs.
                        {Number(
                          product.discountPrice > 0
                            ? product.discountPrice
                            : product.price,
                        ).toLocaleString()}
                      </span>
                     {product.discountPrice > 0 && (<span className="text-gray-400 line-through text-sm ml-2">
                        Rs. {Number(product.price).toLocaleString()}
                      </span>)}
                    </div>
                  </div>

                  <button onClick={()=>addToCart(product)} className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg">
                    Grab Deal
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}

export default page;
