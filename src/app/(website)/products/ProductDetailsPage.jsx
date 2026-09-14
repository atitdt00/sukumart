"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getProductBySlug } from "../../../Services/Product_Services";
import { useCart } from "../../../context/CartContext";

// ======================================================
// PRODUCT DETAIL PAGE
// ======================================================

function ProductDetailsPage({ slug }) {
  // Get the product ID from the dynamic [id] route

  // Get addToCart function from CartContext
  const { addToCart } = useCart();

  // Store the fetched product
  const [product, setProduct] = useState(null);

  // Track whether product data is still loading
  const [loading, setLoading] = useState(true);

  // Store the selected quantity
  const [quantity, setQuantity] = useState(1);

  const [selectedImage, setSelectedImage] = useState(null);

  const [selectedVariants, setSelectedVariants] = useState({});

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);

        // Get product details using the ID from the URL
        const response = await getProductBySlug(slug);

        // If API request was successful, save product data
        if (response.success) {
          setProduct(response.product);
        }
      } catch (error) {
        console.error("Product detail error:", error);
      } finally {
        // Stop loading whether request succeeds or fails
        setLoading(false);
      }
    };

    // Only fetch when ID is available
    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  // ======================================================
  // LOADING STATE
  // ======================================================

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="animate-pulse grid md:grid-cols-2 gap-10">
          <div className="aspect-square bg-gray-200 rounded-xl" />

          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4" />
            <div className="h-8 bg-gray-200 rounded w-3/4" />
            <div className="h-6 bg-gray-200 rounded w-1/3" />
            <div className="h-20 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  // ======================================================
  // PRODUCT NOT FOUND
  // ======================================================

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-800">Product not found</h1>

        <Link
          href="/shop"
          className="inline-block mt-5 text-[#0055B3] font-semibold"
        >
          ← Back to Shop
        </Link>
      </div>
    );
  }

  // ======================================================
  // PRICE CALCULATION
  // ======================================================
  // If the product has a discount price, use it.
  // Otherwise, use the normal price.
  // ======================================================
  const price =
    product.discountPrice > 0 ? product.discountPrice : product.price;

  // Check whether the product actually has a discount
  const hasDiscount =
    product.discountPrice > 0 && product.discountPrice < product.price;

  // Calculate discount percentage
  const discountPercentage = hasDiscount
    ? Math.round(
        ((product.price - product.discountPrice) / product.price) * 100,
      )
    : 0;

  // ======================================================
  // INCREASE QUANTITY
  // ======================================================
  // Increase quantity by 1, but don't allow quantity
  // to become greater than available stock.
  // ======================================================
  const increaseQuantity = () => {
    if (quantity < product.stock) {
      setQuantity((prev) => prev + 1);
    }
  };

  // ======================================================
  // DECREASE QUANTITY
  // ======================================================
  // Decrease quantity by 1, but minimum quantity is 1.
  // ======================================================
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  // ======================================================
  // ADD PRODUCT TO CART
  // ======================================================
  // Adds the selected product to the cart based on
  // the quantity selected by the user.
  // ======================================================
 const handleAddToCart = () => {
  // Check whether all variants are selected
  if (product.variants?.length > 0) {
    const allVariantsSelected = product.variants.every(
      (variant) => selectedVariants[variant.name]
    );

    if (!allVariantsSelected) {
      alert("Please select all product options.");
      return;
    }
  }

  const productWithVariants = {
    ...product,
    selectedVariants,
  };

  for (let i = 0; i < quantity; i++) {
    addToCart(productWithVariants);
  }
};

  // ======================================================
  // MAIN UI
  // ======================================================
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb navigation */}
      <div className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-[#0055B3]">
          Home
        </Link>

        <span className="mx-2">/</span>

        <Link href="/shop" className="hover:text-[#0055B3]">
          Shop
        </Link>

        <span className="mx-2">/</span>

        <span className="text-gray-800">{product.name}</span>
      </div>

      {/* Product image and product information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {/* Product Image */}
        {/* Product Gallery */}
        <div className="flex flex-col gap-1">
          {/* Main Image */}
          <div className="relative bg-gray-50 rounded-2xl overflow-hidden aspect-square">
            <Image
              src={
                selectedImage ||
                (product.thumbnail
                  ? `/image/products/${product.thumbnail}`
                  : "/image/products/sukulogo.jpg")
              }
              alt={product.name || "Product"}
              fill
              className="object-contain p-6"
            />

            {/* Discount */}
            {hasDiscount && (
              <span className="absolute top-2 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-lg">
                -{discountPercentage}%
              </span>
            )}
          </div>

          {/* Thumbnail Gallery */}
          <div className="flex gap-3 overflow-x-auto pb-2">
            {/* Thumbnail images */}
            {(product.gallery && product.gallery.length > 0
              ? product.gallery
              : product.thumbnail
                ? [product.thumbnail]
                : []
            ).map((image, index) => {
              const imageUrl = `/image/products/${image}`;

              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => setSelectedImage(imageUrl)}
                  className={`relative w-20 h-20 shrink-0 rounded-lg overflow-hidden border-2 transition ${
                    selectedImage === imageUrl
                      ? "border-[#0055B3]"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                >
                  <Image
                    src={imageUrl}
                    alt={`${product.name} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Product Details */}
        <div className="flex flex-col">
          {/* Category */}
          <p className="text-sm uppercase font-semibold text-gray-400">
            {product.category_id?.name || "Product"}
          </p>

          {/* Product Name */}
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 mt-2">
            {product.name}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-2 mt-4">
            <span className="text-amber-400">★★★★★</span>

            <span className="text-sm text-gray-500">4.8 (214 reviews)</span>
          </div>

          {/* Product Price */}
          <div className="mt-6 flex items-center gap-3">
            <span className="text-3xl font-extrabold text-[#002D62]">
              Rs. {Number(price).toLocaleString()}
            </span>

            {/* Show original price and discount percentage */}
            {hasDiscount && (
              <>
                <span className="text-lg text-gray-400 line-through">
                  Rs. {Number(product.price).toLocaleString()}
                </span>

                <span className="bg-red-100 text-red-600 text-sm font-bold px-2 py-1 rounded">
                  -{discountPercentage}%
                </span>
              </>
            )}
          </div>

          {/* Stock Information */}
          <div className="mt-5">
            {product.stock > 0 ? (
              <span className="text-green-600 font-semibold">
                ✓ {product.stock} available
              </span>
            ) : (
              <span className="text-red-600 font-semibold">Out of stock</span>
            )}
          </div>

          {/* Product Description */}
          <div className="mt-6 border-t pt-6">
            <h2 className="font-bold text-lg mb-2">Description</h2>

            <p className="text-gray-600 leading-7">
              {product.description ||
                "No description available for this product."}
            </p>
          </div>

          {/* PRODUCT VARIANTS */}

          {product.variants?.length > 0 && (
            <div className="mt-6 border-t pt-6 space-y-5">
              <h2 className="font-bold text-lg">Select Options</h2>

              {product.variants.map((variant, index) => (
                <div key={index} className="flex items-center gap-4 flex-wrap">
                  {/* Variant name */}

                  <p className="font-semibold text-gray-700 mb-2">
                    {variant.name} :
                  </p>

                  {/* Variant options */}

                  <div className="flex flex-wrap gap-2">
                    {variant.options?.map((option, optionIndex) => {
                      const isSelected =
                        selectedVariants[variant.name] === option;

                      return (
                        <button
                          key={optionIndex}
                          type="button"
                          onClick={() => {
                            setSelectedVariants((prev) => ({
                              ...prev,
                              [variant.name]: option,
                            }));
                          }}
                          className={`px-4 py-2 rounded-lg border transition ${
                            isSelected
                              ? "border-[#0055B3] bg-[#0055B3] text-white"
                              : "border-gray-300 text-gray-700 hover:border-[#0055B3] hover:text-[#0055B3]"
                          }`}
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Quantity Selector */}
          {product.stock > 0 && (
            <div className="mt-6">
              <p className="font-semibold text-gray-700 mb-2">Quantity</p>

              <div className="flex items-center border border-gray-300 rounded-lg w-fit">
                {/* Decrease quantity */}
                <button
                  type="button"
                  onClick={decreaseQuantity}
                  className="px-4 py-2 text-lg hover:bg-gray-100"
                >
                  −
                </button>

                {/* Current quantity */}
                <span className="px-5 py-2 font-semibold">{quantity}</span>

                {/* Increase quantity */}
                <button
                  type="button"
                  onClick={increaseQuantity}
                  disabled={quantity >= product.stock}
                  className="px-4 py-2 text-lg hover:bg-gray-100 disabled:opacity-40"
                >
                  +
                </button>
              </div>
            </div>
          )}

          {/* Add to Cart and Wishlist Buttons */}
          <div className="flex gap-3 mt-8">
            {/* Add to Cart */}
            <button
              type="button"
              disabled={product.stock <= 0}
              onClick={handleAddToCart}
              className="flex-1 bg-[#002D62] text-white py-3 rounded-lg font-semibold hover:bg-[#0055B3] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
            </button>

            {/* Wishlist */}
            <button
              type="button"
              className="w-12 h-12 border border-gray-300 rounded-lg text-gray-500 hover:text-red-500 hover:border-red-500"
            >
              ♥
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default ProductDetailsPage;
