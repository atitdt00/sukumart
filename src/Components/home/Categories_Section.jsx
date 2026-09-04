"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getCategories } from "../../Services/Category_Service";

function Categories_Section() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]=useState(false);

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const data = await getCategories();
      setCategories(data || []);
    } catch (error) {
      console.error("Category Api error", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-6 mb-10">
      {/* Heading */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-display text-xl font-extrabold text-gray-800">
          Browse <span className="text-[#0055B3]">Categories</span>
        </h2>

        <Link
          href="/categories"
          className="flex items-center gap-1.5 text-[13px] font-bold text-[#0055B3] no-underline hover:gap-3 transition-all"
        >
          View all
          <span className="text-[11px]">→</span>
        </Link>
      </div>

      {/* Categories */}
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
      {/* loading state and categorie card icons */}
      {loading ?  (
        //skeleton loading 
        Array.from({length: 8}).map((_, index)=>(
          <div key={index} className="flex flex-col items-center gap-2 animate-plus">
            {/* image skeleton */}
              <div className="w-[52px] h-[52px] rounded-[14px] bg-gray-200"></div>

              {/* text skeleton */}
              <div className="h-3 w-14 bg-gray-200 rounded"></div>
          </div>
        )) 
      ): categories.length=== 0 ? (
        <p className="col-span-full text-center text-gray-500">No Categories found</p>
      ):(categories.map((category)=> (
          <Link
            key={category._id}
            href={`/categories/${category.slug}`}
            className="cat-card"
          >
            <div className="w-[52px] h-[52px] rounded-[14px] bg-blue-100 overflow-hidden">
              <Image
                src={category.image || "/image/products/samsung_1.jpg"}
                alt={category.name}
                width={52}
                height={52}
                className="object-cover"
              />
             
            </div>
            {category.name}
          </Link>
        ))
        )}
      </div>
    </section>
  );
}

export default Categories_Section;
