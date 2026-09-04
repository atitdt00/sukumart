"use client"

import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { getCategoryBySlug } from '../../../../Services/Category_Service.js';
import Link from 'next/link';
import Image from 'next/image';

function page() {
  const params= useParams();

  const [category, setCategory]= useState(null);
  const [products, setProducts]= useState([]);

  useEffect(()=>{
    const fetchCategoryProducts= async()=>{
      try{
        const data= await getCategoryBySlug(params.slug);
        setCategory(data.category);
        setProducts(data.products || []);
      }catch(error){
          console.error(
            "Category products error:", error
          )
      }
    };

    if(params.slug){
      fetchCategoryProducts()
    }
  },[params.slug]);

  if(!category){
    return (
      <div className='max-w-7xl mx-auto px-6 py-20'>
        Loading...
      </div>
    )
  }

  return (
    <div>
      <section className="max-w-7xl mx-auto px-6 py-10">

      {/* Category title */}

      <div className="mb-8">

        <Link
          href="/categories"
          className="text-sm text-[#0055B3]"
        >
          ← All Categories
        </Link>

        <h1 className="text-3xl font-bold text-gray-800 mt-3">
          {category.name}
        </h1>

        <p className="text-gray-400 mt-1">
          {products.length} products
        </p>

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

              <div className="relative aspect-square bg-gray-100">

                <Image
                  src={
                    product.thumbnail?.startsWith("http")? "/image/mobile_1.jpg": product.thumbnail ||
                    "/image/mobile_1.jpg"
                  }
                  alt={product.name}
                  fill
                  className="object-cover"
                />

              </div>

              <div className="p-4">

                <p className="text-xs text-gray-400 uppercase">
                  {category.name}
                </p>

                <h2 className="font-semibold text-gray-800 mt-1">
                  {product.name}
                </h2>

                <div className="mt-3">

                  {product.discountPrice > 0 ? (
                    <>
                      <span className="font-bold text-[#002D62]">
                        Rs.{" "}
                        {product.discountPrice.toLocaleString()}
                      </span> 

                      <span className="ml-2 text-xs text-gray-400 line-through">
                        Rs.{" "}
                        {product.price.toLocaleString()}
                      </span>
                    </>
                  ) : (
                    <span className="font-bold text-[#002D62]">
                      Rs. {product.price.toLocaleString()}
                    </span>
                  )}

                </div>

              </div>

            </div>

          ))}

        </div>

      )}

    </section>
      
    </div>
  )
}

export default page
