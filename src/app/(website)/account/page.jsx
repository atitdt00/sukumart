
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { getMyOrders } from "../../../Services/Order_Service";
import { useUser } from "@clerk/nextjs";
import { useModal } from "../../../context/ModalContext"

function page() {
  const router = useRouter();

  const {openLogin }= useModal()

  const { user, isSignedIn, isLoaded }= useUser();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading]= useState(false);

  // =========================
  // FETCH ACCOUNT DATA
  // =========================
  const fetchAccountData = async () => {
    try {
        setLoading(true)


//Check Authentication
        if(!isSignedIn || !user){
           openLogin();

          return
        }
      // Get only logged-in user's orders
      const orderResponse = await getMyOrders();

      if (orderResponse?.success) {
        setOrders(orderResponse.orders || []);
      }else{
        setOrders([])
      }

    } catch (error) {
      console.error("Account page error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to load account information",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if(!isLoaded) return;
    fetchAccountData();
  }, [isLoaded, isSignedIn, user]);

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-10 w-52 bg-gray-200 rounded-lg"></div>
            <div className="h-32 bg-white rounded-2xl"></div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="h-28 bg-white rounded-2xl"></div>
              <div className="h-28 bg-white rounded-2xl"></div>
              <div className="h-28 bg-white rounded-2xl"></div>
              <div className="h-28 bg-white rounded-2xl"></div>
            </div>

            <div className="h-64 bg-white rounded-2xl"></div>
          </div>
        </div>
      </main>
    );
  }

  // =========================
  // ORDER STATISTICS
  // =========================
  const pendingOrders = orders.filter(
    (order) =>
      order.status === "pending" ||
      order.status === "confirmed" ||
      order.status === "processing",
  ).length;

  const deliveredOrders = orders.filter(
    (order) => order.status === "delivered",
  ).length;

  const cancelledOrders = orders.filter(
    (order) => order.status === "cancelled",
  ).length;

  // =========================
  // STATUS STYLE
  // =========================
  const getStatusStyle = (status) => {
    switch (status) {
      case "delivered":
        return "bg-green-50 text-green-700 border-green-200";

      case "cancelled":
        return "bg-red-50 text-red-700 border-red-200";

      case "shipped":
        return "bg-blue-50 text-blue-700 border-blue-200";

      case "processing":
        return "bg-purple-50 text-purple-700 border-purple-200";

      case "confirmed":
        return "bg-indigo-50 text-indigo-700 border-indigo-200";

      default:
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
    }
  };

  // =========================
  // PAYMENT STYLE
  // =========================
  const getPaymentStatusStyle = (status) => {
    switch (status) {
      case "paid":
        return "text-green-600";

      case "failed":
        return "text-red-600";

      default:
        return "text-yellow-600";
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">

        {/* =====================================
            PAGE HEADER
        ===================================== */}
        <div className="mb-7 sm:mb-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">

            <div>
              <p className="text-sm font-semibold text-[#0055B3] mb-1">
                CUSTOMER DASHBOARD
              </p>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#002D62]">
                My Account
              </h1>

              <p className="text-sm sm:text-base text-gray-500 mt-2">
                Welcome back, {user?.fullName ||  user?.firstName || "User"}.
                Manage your account and track your orders.
              </p>
            </div>

            <button
              onClick={() => router.push("/shop")}
              className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#002D62] hover:bg-[#0055B3] text-white font-medium transition"
            >
              <i className="fa-solid fa-bag-shopping"></i>
              Continue Shopping
            </button>

          </div>
        </div>

        {/* =====================================
            PROFILE CARD
        ===================================== */}
        <div className="relative overflow-hidden bg-[#002D62] rounded-2xl sm:rounded-3xl p-5 sm:p-7 text-white mb-6 sm:mb-8">

          {/* Decorative circles */}
          <div className="absolute -right-12 -top-12 w-40 h-40 rounded-full bg-white/5"></div>
          <div className="absolute right-10 -bottom-20 w-52 h-52 rounded-full bg-white/5"></div>

          <div className="relative flex flex-col sm:flex-row sm:items-center gap-5">

            {/* Avatar */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center">

              <i className="fa-solid fa-user text-2xl sm:text-3xl"></i>

            </div>

            {/* User information */}
            <div className="min-w-0 flex-1">

              <p className="text-sm text-blue-100 mb-1">
                Account Information
              </p>

              <h2 className="text-xl sm:text-2xl font-bold truncate">
                {user?.fullName || "User"}
              </h2>

              <p className="text-sm sm:text-base text-blue-100 mt-1 break-all">
                {user?.email}
              </p>

            </div>

            {/* Order count */}
            <div className="sm:text-right border-t sm:border-t-0 border-white/20 pt-4 sm:pt-0">

              <p className="text-sm text-blue-100">
                Total Orders
              </p>

              <p className="text-3xl font-bold mt-1">
                {orders.length}
              </p>

            </div>

          </div>
        </div>

        {/* =====================================
            ORDER STATISTICS
        ===================================== */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">

          {/* Total */}
          <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-5">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-xs sm:text-sm text-gray-500">
                  Total Orders
                </p>

                <p className="text-2xl sm:text-3xl font-bold text-gray-800 mt-1">
                  {orders.length}
                </p>
              </div>

              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-blue-50 text-[#0055B3] flex items-center justify-center">
                <i className="fa-solid fa-box"></i>
              </div>

            </div>

          </div>

          {/* Pending */}
          <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-5">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-xs sm:text-sm text-gray-500">
                  Active Orders
                </p>

                <p className="text-2xl sm:text-3xl font-bold text-gray-800 mt-1">
                  {pendingOrders}
                </p>
              </div>

              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-yellow-50 text-yellow-600 flex items-center justify-center">
                <i className="fa-solid fa-clock"></i>
              </div>

            </div>

          </div>

          {/* Delivered */}
          <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-5">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-xs sm:text-sm text-gray-500">
                  Delivered
                </p>

                <p className="text-2xl sm:text-3xl font-bold text-gray-800 mt-1">
                  {deliveredOrders}
                </p>
              </div>

              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
                <i className="fa-solid fa-circle-check"></i>
              </div>

            </div>

          </div>

          {/* Cancelled */}
          <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-5">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-xs sm:text-sm text-gray-500">
                  Cancelled
                </p>

                <p className="text-2xl sm:text-3xl font-bold text-gray-800 mt-1">
                  {cancelledOrders}
                </p>
              </div>

              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                <i className="fa-solid fa-circle-xmark"></i>
              </div>

            </div>

          </div>

        </div>

        {/* =====================================
            ORDER HISTORY HEADER
        ===================================== */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">

          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
              Order History
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              View all your recent purchases and order details.
            </p>
          </div>

          <span className="self-start sm:self-auto px-3 py-1.5 rounded-full bg-gray-100 text-gray-600 text-sm">
            {orders.length} order
            {orders.length !== 1 ? "s" : ""}
          </span>

        </div>

        {/* =====================================
            NO ORDERS
        ===================================== */}
        {orders.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-2xl sm:rounded-3xl p-8 sm:p-12 text-center">

            <div className="w-20 h-20 mx-auto rounded-full bg-blue-50 text-[#0055B3] flex items-center justify-center">

              <i className="fa-solid fa-box-open text-3xl"></i>

            </div>

            <h3 className="text-xl font-bold text-gray-800 mt-5">
              No orders yet
            </h3>

            <p className="text-sm sm:text-base text-gray-500 mt-2 max-w-md mx-auto">
              You haven't placed any orders yet. Explore our products
              and find something you love.
            </p>

            <button
              onClick={() => router.push("/shop")}
              className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#002D62] hover:bg-[#0055B3] text-white font-medium transition"
            >
              <i className="fa-solid fa-bag-shopping"></i>
              Start Shopping
            </button>

          </div>
        ) : (

          /* =====================================
             ORDERS
          ===================================== */
          <div className="space-y-5">

            {orders.map((order) => (

              <article
                key={order._id}
                className="bg-white border border-gray-200 rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition"
              >

                {/* =================================
                    ORDER HEADER
                ================================= */}
                <div className="p-4 sm:p-6 border-b border-gray-100">

                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

                    {/* Order information */}
                    <div className="min-w-0">

                      <div className="flex flex-wrap items-center gap-2">

                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                          Order
                        </span>

                        <span className="font-bold text-gray-800 break-all">
                          #{order.orderId}
                        </span>

                      </div>

                      <p className="text-xs sm:text-sm text-gray-500 mt-2">
                        <i className="fa-regular fa-calendar mr-2"></i>
                        {new Date(order.createdAt).toLocaleString()}
                      </p>

                    </div>

                    {/* Status + total */}
                    <div className="flex flex-wrap items-center justify-between lg:justify-end gap-3">

                      <span
                        className={`px-3 py-1.5 rounded-full border text-xs sm:text-sm font-semibold capitalize ${getStatusStyle(
                          order.status,
                        )}`}
                      >
                        <i className="fa-solid fa-circle text-[7px] mr-2"></i>
                        {order.status || "pending"}
                      </span>

                      <div className="text-right">

                        <p className="text-xs text-gray-500">
                          Order Total
                        </p>

                        <p className="text-lg sm:text-xl font-bold text-[#002D62]">
                          Rs.{" "}
                          {Number(order.total || 0).toLocaleString()}
                        </p>

                      </div>

                    </div>

                  </div>
                </div>

                {/* =================================
                    PRODUCTS
                ================================= */}
                <div className="p-4 sm:p-6">

                  <div className="space-y-4">

                    {order.products?.map((product, index) => (

                      <div
                        key={product._id || index}
                        className="flex flex-col sm:flex-row sm:items-center gap-4 pb-4 border-b border-gray-100 last:border-b-0 last:pb-0"
                      >

                        {/* Product icon */}
                        <div className="w-12 h-12 shrink-0 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400">

                          <i className="fa-solid fa-box"></i>

                        </div>

                        {/* Product information */}
                        <div className="min-w-0 flex-1">

                          <p className="font-semibold text-gray-800 break-words">
                            {product.name}
                          </p>

                          {/* Variants */}
                          {product.selectedVariants &&
                            Object.entries(product.selectedVariants).length >
                              0 && (
                              <div className="flex flex-wrap gap-2 mt-2">

                                {Object.entries(
                                  product.selectedVariants,
                                ).map(([name, value]) => (

                                  <span
                                    key={name}
                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gray-100 text-xs text-gray-600"
                                  >
                                    <span className="font-semibold">
                                      {name}:
                                    </span>

                                    {value}
                                  </span>

                                ))}

                              </div>
                            )}

                          <p className="text-sm text-gray-500 mt-2">
                            Quantity:{" "}
                            <span className="font-medium text-gray-700">
                              {product.quantity}
                            </span>
                          </p>

                        </div>

                        {/* Product price */}
                        <div className="sm:text-right">

                          <p className="text-xs text-gray-400">
                            Price
                          </p>

                          <p className="font-bold text-gray-800 whitespace-nowrap">
                            Rs.{" "}
                            {(
                              Number(product.price || 0) *
                              Number(product.quantity || 0)
                            ).toLocaleString()}
                          </p>

                        </div>

                      </div>

                    ))}

                  </div>

                  {/* =================================
                      PAYMENT INFORMATION
                  ================================= */}
                  <div className="mt-6 pt-5 border-t border-gray-200">

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                      {/* Payment method */}
                      <div className="flex items-center justify-between sm:justify-start gap-3">

                        <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500">
                          <i className="fa-solid fa-credit-card"></i>
                        </div>

                        <div>
                          <p className="text-xs text-gray-400">
                            Payment Method
                          </p>

                          <p className="text-sm font-semibold text-gray-800 uppercase">
                            {order.paymentMethod}
                          </p>
                        </div>

                      </div>

                      {/* Payment status */}
                      <div className="flex items-center justify-between sm:justify-end gap-3">

                        <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500">
                          <i className="fa-solid fa-money-check-dollar"></i>
                        </div>

                        <div className="sm:text-right">

                          <p className="text-xs text-gray-400">
                            Payment Status
                          </p>

                          <p
                            className={`text-sm font-semibold capitalize ${getPaymentStatusStyle(
                              order.paymentStatus,
                            )}`}
                          >
                            {order.paymentStatus || "pending"}
                          </p>

                        </div>

                      </div>

                    </div>

                  </div>

                </div>

              </article>

            ))}

          </div>

        )}

      </div>
    </main>
  );
}

export default page;

