"use client"
import React, { useState } from "react";
import { toast } from "react-toastify";
import { trackOrder } from "../../../Services/Order_Service";

function page() {

  const [loading, setLoading]=useState(false);
  const [order, setOrder]=useState(null)
  const [orderId, setOrderId]=useState("")


  const handleTrackOrder=async(e)=>{
    e.preventDefault();
    if(!orderId.trim()){
      toast.error("please enter your Order ID");
      return;
    }
    try{
      setLoading(true);
      setOrder(null);

      const response= await trackOrder(orderId.trim());

      if(response?.success){
        setOrder(response.order);
      }

    }catch(error){
      console.log("Track order page error:",error)

      setOrder(null);

      toast.error(error.response?.data?.message  || "Failed to track order");

    }finally{
      setLoading(false)
    }
  }
  return (
    <>
      {/* TRACK ORDER PAGE  */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-display font-extrabold text-gray-800">
            Track <span className="text-[#0055B3]">Your Order</span>
          </h1>
          <p className="text-gray-500 mt-2 text-sm">
            Enter your order ID to check delivery status
          </p>
        </div>

        <div className="max-w-xl mx-auto bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm">
          <form className="space-y-4" onSubmit={handleTrackOrder} >
            <input
              type="text"
              placeholder="Enter Order ID (e.g. SUK123456)"
              onChange={(e)=>setOrderId(e.target.value.toUpperCase())}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0055B3]"
            />

            <button
              type="submit"
              className="w-full bg-[#002D62] text-white py-3 rounded-lg font-semibold hover:bg-[#0055B3] transition"
            >
              {loading? "Tracking...":  "Track Order"}
            </button>
          </form>

          {/* order Result */}
          {/* Sample status UI */}

          {order && (

       
          <div className="mt-8 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Order Placed</span>
              <span className="text-green-600 font-semibold">✔ Completed</span>
            </div>

            {/* processing  */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Processing</span>

              <span className={order.status=== "processing" ? "text-yellow-600 font-semibold" : "text-gray-400"}>
                {order.status === "processing"? "⏳ In Progress" : "Pending"}
              </span>
            </div>

              {/* Shipped */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Shipped</span>

              <span className={order.status==="shipped"? "text-gray-400": "text-gray-400"}>{order.status==="shipped"? "🚚 Shipped": "Pending"}</span>
            </div>

            {/* Delivery */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Delivered</span>
              <span className={order.status==="delivered"? "text-gray-400":"text-gray-400"}> {order.status=="delivered"? "✔️Deliverd": "Pending"}</span>
            </div>
              </div>
            )}
              </div>
      </section>
    </>
  );
}

export default page;
