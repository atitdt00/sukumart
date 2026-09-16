"use client";

import Image from "next/image";
import React, { useState } from "react";
import { useCart } from "../../../context/CartContext";
import Link from "next/link";
import { toast } from "react-toastify";
import { useModal } from "../../../context/ModalContext";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

function page() {
  const [checkingAuth, setCheckingAuth] = useState(false);
  const { openLogin } = useModal();
  const router = useRouter();

  const { isLoaded, isSignedIn, }= useUser();

  const { cart, removeFromCart, decreaseQuantity, increaseQuantity } =
    useCart();

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

  //checkout Authentication handler
  const handleCheckout = async () => {
    try {
      setCheckingAuth(true);

      if(!isLoaded){
        return;
      }

      if (!isSignedIn) {
        toast.error("please login before proceeding to checkout");
        openLogin();
        return;
      }
      router.push("/checkout");
    } catch (error) {
      console.error("Authentication error", error);
      if (error.response?.status === 401) {
        toast.error("please login before proceeding to checkout");
        openLogin();
        return;
      }
      toast.error("Something went wrong");
    } finally {
      setCheckingAuth(false);
    }
  };

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* <!-- Heading --> */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
            Shopping Cart
          </h1>
          <p className="text-gray-500 mt-2">
            Review your items before checkout.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* <!-- Cart Items --> */}
          <div className="lg:col-span-2 space-y-5 lg:h-[calc(100vh-180px)] lg:overflow-y-auto lg:pr-2">
            {/* <!-- Product --> */}
            {cart.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm p-10 text-center">
                <i className="fa-solid fa-cart-shopping text-4xl text-gray-300"></i>

                <h2 className="text-xl font-bold text-gray-700 mt-4">
                  Your cart is empty
                </h2>

                <p className="text-gray-500 mt-2">
                  Add some products to your cart.
                </p>

                <Link
                  href="/shop"
                  className="inline-block mt-5 bg-blue-600 text-white px-6 py-3 rounded-xl"
                >
                  Continue Shopping
                </Link>
              </div>
            ) : (
              cart.map((product) => (
                <div
                  key={product._id}
                  className="bg-white rounded-2xl shadow-sm p-4 flex flex-col sm:flex-row gap-4"
                >
                  <Image
                    src={
                      product.thumbnail
                        ? `/image/products/${product.thumbnail}`
                        : "/image/products/sukumartlogo.jpg"
                    }
                    alt={product.name}
                    className="w-full sm:w-32 h-32 object-cover rounded-xl"
                    width={128}
                    height={128}
                  />

                  <div className="flex-1 ">
                    <h3 className="font-semibold text-lg">{product.name}</h3>
                    <p className="text-gray-500 text-sm mt-1">
                      {product.description}
                    </p>

                    <div className="flex flex-wrap items-center justify-between mt-4 gap-3">
                      <div className="flex items-center border rounded-lg overflow-hidden">
                        <button
                          onClick={() => decreaseQuantity(product)}
                          className="px-3 py-2 hover:bg-gray-100"
                        >
                          -
                        </button>
                        <span className="px-4">{product.quantity}</span>
                        <button
                          onClick={() => increaseQuantity(product)}
                          className="px-3 py-2 hover:bg-gray-100"
                        >
                          +
                        </button>
                      </div>
                      {product.selectedVariants &&
                        Object.entries(product.selectedVariants).map(
                          ([name, value]) => (
                            <p
                              key={name}
                              className="text-sm text-gray-600 mt-1"
                            >
                              <span className="font-semibold">{name}:</span>{" "}
                              {value}
                            </p>
                          ),
                        )}

                      <div className="text-right">
                        <p className="font-bold text-blue-600">
                          Price {product.price?.toLocaleString()}{" "}
                        </p>
                        <button
                          onClick={() => removeFromCart(product)}
                          className="text-red-500 text-sm hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          {/* <!-- Order Summary --> */}
          <div>
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-6">
              <h2 className="text-xl font-bold mb-5">Order Summary</h2>

              <div className="space-y-4 text-gray-600">
                <div className="flex justify-between">
                  <span>Items</span>

                  <span>
                    {cart.reduce((total, item) => total + item.quantity, 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>
                    Rs.
                    {subtotal.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Rs. {shipping.toLocaleString()}</span>
                </div>

                <div className="flex justify-between">
                  <span>Tax(13%)</span>
                  <span>{tax.toLocaleString()}</span>
                </div>

                <hr />

                <div className="flex justify-between text-lg font-bold text-gray-800">
                  <span>Total</span>
                  <span>Rs.{total.toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={checkingAuth}
                className="block w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition text-center"
              >
                {checkingAuth ? "Checking..." : "Proceed to Checkout"}
              </button>

              <Link
                href={"/categories"}
                className="block w-full mt-6 border border-gray-300 hover:bg-gray-50 py-3 rounded-xl font-medium transition text-center"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default page;
