import Image from "next/image";
import React from "react";

function page() {
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
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* <!-- Deal Card --> */}
          <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition">
            <div className="relative">
              <Image
                src="/image/products/shoes.jpg"
                className="w-full h-52 object-cover"
                alt="shoes"
                width={200}
                height={220}
              />

              <span className="absolute top-3 left-3 bg-red-500 text-white text-xs px-3 py-1 rounded-full">
                -30%
              </span>
            </div>

            <div className="p-4">
              <h3 className="font-semibold">Nike Shoes</h3>

              <div className="flex items-center gap-1 text-yellow-400 text-sm mt-1">
                ⭐⭐⭐⭐☆ <span className="text-gray-500">(4.2)</span>
              </div>

              <div className="mt-2 flex items-center justify-between">
                <div>
                  <span className="text-red-500 font-bold">$90</span>
                  <span className="text-gray-400 line-through text-sm ml-2">
                    $130
                  </span>
                </div>
              </div>

              <button className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg">
                Grab Deal
              </button>
            </div>
          </div>

          {/* <!-- Deal Card --> */}
          <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition">
            <Image
              src="/image/products/hand_watch_4.jpg"
              width={200}
              height={220}
              className="w-full h-52 object-cover"
              alt="smart watch"
            />

            <div className="p-4">
              <h3 className="font-semibold">Smart Watch</h3>

              <div className="flex items-center gap-1 text-yellow-400 text-sm mt-1">
                ⭐⭐⭐⭐⭐ <span className="text-gray-500">(4.8)</span>
              </div>

              <div className="mt-2">
                <span className="text-red-500 font-bold">$150</span>
                <span className="text-gray-400 line-through text-sm ml-2">
                  $200
                </span>
              </div>

              <button className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg">
                Grab Deal
              </button>
            </div>
          </div>

          {/* <!-- Deal Card --> */}
          <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition">
            <Image
              src="/image/products/hand_watch_3.jpg"
              width={200}
              height={220}
              className="w-full h-52 object-cover"
              alt="headphoes"
            />

            <div className="p-4">
              <h3 className="font-semibold">Headphones</h3>

              <div className="flex items-center gap-1 text-yellow-400 text-sm mt-1">
                ⭐⭐⭐⭐☆ <span className="text-gray-500">(4.1)</span>
              </div>

              <div className="mt-2">
                <span className="text-red-500 font-bold">$70</span>
                <span className="text-gray-400 line-through text-sm ml-2">
                  $110
                </span>
              </div>

              <button className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg">
                Grab Deal
              </button>
            </div>
          </div>

          {/* <!-- Deal Card --> */}
          <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition">
            <Image
              src="/image/products/mobile_1.jpg"
              className="w-full h-52 object-cover"
              alt="phone"
              width={200}
              height={220}
            />

            <div className="p-4">
              <h3 className="font-semibold">iPhone Style Phone</h3>

              <div className="flex items-center gap-1 text-yellow-400 text-sm mt-1">
                ⭐⭐⭐⭐⭐ <span className="text-gray-500">(4.9)</span>
              </div>

              <div className="mt-2">
                <span className="text-red-500 font-bold">$499</span>
                <span className="text-gray-400 line-through text-sm ml-2">
                  $650
                </span>
              </div>

              <button className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg">
                Grab Deal
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default page;
