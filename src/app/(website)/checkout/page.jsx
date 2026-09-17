"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "../../../context/CartContext";
import { useForm } from "react-hook-form";
import { createOrder } from "../../../Services/Order_Service";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useModal } from "../../../context/ModalContext";
import {
  initiateEsewaPayment,
  initiateKhaltiPayment,
} from "../../../Services/Payment_Service";
import { useUser } from "@clerk/nextjs";

function page() {
  const { cart, clearCart } = useCart();
  const { openLogin } = useModal();
  const router = useRouter();

  const [loading, setLoading] = useState(false);


  const { user, isSignedIn, isLoaded } = useUser();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fullName: "",
      email: "",
      paymentMethod: "cod",
    },
  });

  // Subtotal
  const subtotal = cart.reduce(
    (total, item) =>
      total +
      (item.discountPrice > 0 ? item.discountPrice : item.price) *
        item.quantity,
    0,
  );

  // Shipping
  const shipping = cart.length > 0 ? 100 : 0;

  // Tax
  const tax = subtotal * 0.13;

  // Total
  const total = subtotal + shipping + tax;

  //handle Esewa payment

  const handleEsewaPayment = async (orderId) => {
    try {
      const response = await initiateEsewaPayment(orderId);

      if (!response.success) {
        toast.error("Unable to initiate eSewa payment");
        return;
      }

      const form = document.createElement("Form");

      form.method = "POST";

      form.action = response.paymentUrl;

      Object.entries(response.paymentData).forEach(([key, value]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = String(value);
        form.appendChild(input);
      });

      document.body.appendChild(form);

      form.submit();
    } catch (error) {
      console.error(error);
      toast.error("eSewa payment failed");
    }
  };

  //handle khalti payment
  const handleKhaltiPayment = async (orderId) => {
    try {
      const response = await initiateKhaltiPayment(orderId);

      if (!response.success) {
        toast.error(response.message || "Khalti payment failed");
        return;
      }

      // Redirect to Khalti
      window.location.href = response.paymentUrl;
    } catch (error) {
      console.error("Khalti error:", error);

      toast.error(
        error.response?.data?.message || "Unable to start Khalti payment",
      );
    }
  };


  //form data submission

  
  const onSubmit = async (formData) => {
    if (cart.length === 0) {
      alert("Your cart is empty");
      return;
    }
    try {
      setLoading(true);

      //ckeck logged-in user
      // const user = await getCurrentUser();
      // if (!user?.success) {
      //   toast.error("Please login at first before placing an order");
      //   openLogin();
      //   return;
      // }

      if(!isLoaded){
        toast.info("checking your login...");
        return;
      }

      if(!isSignedIn){
        toast.error("please login before place to order..")
        openLogin();
        return;
      }

      //create order data
      const orderData = {
        customer: formData,
        products: cart.map((item) => ({
          productId: item._id,
          name: item.name,
          price: item.discountPrice > 0 ? item.discountPrice : item.price,
          quantity: item.quantity,
          thumbnail: item.thumbnail,

          selectedVariants: item.selectedVariants || {},
        })),
        subtotal,
        shipping,
        tax,
        total,
        paymentMethod: formData.paymentMethod,
      };

      //create order
      const response = await createOrder(orderData);
      console.log("checkout order", response);
      if (!response.success) {
        toast.error(response.message || "Failed to place orders");
        return;
      }

      //take orderId
      const orderId = response.order.orderId;

      if (formData.paymentMethod === "cod") {
        clearCart();
        toast.success("Order placed successfully");
        router.push(`/payment-success?order=${orderId}`);
        return;
      }

      if (formData.paymentMethod === "esewa") {
        await handleEsewaPayment(orderId);
        return;
      }

      if (formData.paymentMethod === "khalti") {
        await handleKhaltiPayment(orderId);
        return;
      }

      //clear form
      reset({
        fullName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        paymentMethod: "cod",
      });

      toast.success("order placed successfully!");

      //redirect to home page
    } catch (error) {
      console.error("Checkout error:", error);

      console.log("Status:", error.response?.status);
      console.log("Response:", error.response?.data);

      //user is not logged-in
      if (error.response?.status === 401) {
        toast.error("please login before placing an order");
        openLogin();
        return;
      }
      toast.error(error.response?.data?.message || "something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold">Your cart is empty</h1>

        <p className="text-gray-500 mt-3">
          Add products before proceeding to checkout.
        </p>

        <Link
          href="/shop"
          className="inline-block mt-6 bg-blue-600 text-white px-6 py-3 rounded-xl"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
          Checkout
        </h1>

        <p className="text-gray-500 mt-2">
          Complete your details and place your order.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid lg:grid-cols-3 gap-8"
      >
        {/* CUSTOMER DETAILS */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-bold mb-6">Billing Details</h2>

            <div className="grid md:grid-cols-2 gap-5">
              {/* Full Name */}
              <div>
                <label className="block mb-2 font-medium">Name</label>

                <input
                  type="text"
                  name="fullName"
                  {...register("fullName", { required: "Name is required" })}
                  placeholder="Enter your full name"
                  className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.fullName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block mb-2 font-medium">Email</label>

                <input
                  type="email"
                  name="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "Enter a valid email",
                    },
                  })}
                  placeholder="Enter your email"
                  className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block mb-2 font-medium">Phone Number</label>

                <input
                  type="tel"
                  name="phone"
                  placeholder="Enter your phone number"
                  className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  {...register("phone", {
                    required: "Phone number is required",
                  })}
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              {/* City */}
              <div>
                <label className="block mb-2 font-medium">City</label>

                <input
                  type="text"
                  name="city"
                  {...register("city", {
                    required: "City is required",
                  })}
                  placeholder="Enter your city"
                  className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.city && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.city.message}
                  </p>
                )}
              </div>
            </div>

            {/* Address */}
            <div className="mt-5">
              <label className="block mb-2 font-medium">Delivery Address</label>

              <textarea
                name="address"
                {...register("address", {
                  required: "Delivery address is required",
                })}
                placeholder="Enter your full delivery address"
                rows="4"
                className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.address && (
                <p className="text-red-500 text-sm mt-1">
                  {" "}
                  {errors.address.message}{" "}
                </p>
              )}
            </div>
          </div>

          {/* PAYMENT METHOD */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-bold mb-5">Payment Method</h2>

            <div className="space-y-4">
              <label className="flex items-center gap-3 border rounded-xl p-4 cursor-pointer">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  {...register("paymentMethod", {
                    required: "Please select a payment method",
                  })}
                />

                <span className="font-medium">Cash on Delivery</span>
              </label>

              <label className="flex items-center gap-3 border rounded-xl p-4 cursor-pointer">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="esewa"
                  {...register("paymentMethod")}
                />

                <span className="font-medium">eSewa</span>
              </label>

              <label className="flex items-center gap-3 border rounded-xl p-4 cursor-pointer">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="khalti"
                  {...register("paymentMethod")}
                />

                <span className="font-medium">Khalti</span>
              </label>
              {errors.paymentMethod && (
                <p className="text-red-500 text-sm">
                  {" "}
                  {errors.paymentMethod.message}{" "}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ORDER SUMMARY */}
        <div>
          <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-6">
            <h2 className="text-xl font-bold mb-5">Your Order</h2>

            {/* PRODUCTS */}
            <div className="space-y-4 max-h-64 overflow-y-auto">
              {cart.map((item) => (
                <div
                  key={`${item._id}-${JSON.stringify(item.selectedVariants || {})}`}
                  className="flex justify-between gap-4"
                >
                  <div className="space-y-5">
                    <p className="font-medium">{item.name}</p>

                    <p className="text-sm text-gray-500">
                      Qty: {item.quantity}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2">
                    <span className="font-medium">
                      Rs.{" "}
                      {(
                        (item.discountPrice > 0
                          ? item.discountPrice
                          : item.price) * item.quantity
                      ).toLocaleString()}
                    </span>
                    {/* selected Variants */}
                    {item.selectedVariants &&
                      Object.entries(item.selectedVariants).map(
                        ([name, value]) => (
                          <p key={name} className="text-sm text-gray-500">
                            {name} : {value}{" "}
                          </p>
                        ),
                      )}
                  </div>
                </div>
              ))}
            </div>

            <hr className="my-5" />

            {/* PRICE DETAILS */}
            <div className="space-y-3 text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>Rs. {subtotal.toLocaleString()}</span>
              </div>

              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Rs. {shipping.toLocaleString()}</span>
              </div>

              <div className="flex justify-between">
                <span>Tax (13%)</span>
                <span>Rs. {tax.toLocaleString()}</span>
              </div>

              <hr />

              <div className="flex justify-between text-lg font-bold text-gray-800">
                <span>Total</span>
                <span>Rs. {total.toLocaleString()}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition"
            >
              {loading ? "Placing order..." : "Place Order"}
            </button>

            <Link
              href="/cart"
              className="block text-center mt-4 text-gray-500 hover:text-blue-600"
            >
              ← Back to Cart
            </Link>
          </div>
        </div>
      </form>
    </section>
  );
}

export default page;
