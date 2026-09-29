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
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedVariants, setSelectedVariants] = useState({});

  // ======================================================
  // FETCH PRODUCT
  // ======================================================

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);

        const response = await getProductBySlug(slug);

        if (response.success) {
          setProduct(response.product);
        }
      } catch (error) {
        console.error("Product detail error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  // ======================================================
  // LOADING
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
        <h1 className="text-2xl font-bold text-gray-800">
          Product not found
        </h1>

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
  // CATEGORY INFORMATION
  // ======================================================

  const category = product.category_id;

  const parentCategory = category?.parent_id || null;

  const isSubcategory = Boolean(parentCategory);

  const mainCategory = isSubcategory
    ? parentCategory
    : category;

  const subcategory = isSubcategory
    ? category
    : null;

  // ======================================================
  // PRICE
  // ======================================================

  const price =
    product.discountPrice > 0
      ? product.discountPrice
      : product.price;

  const hasDiscount =
    product.discountPrice > 0 &&
    product.discountPrice < product.price;

  const discountPercentage = hasDiscount
    ? Math.round(
        ((product.price - product.discountPrice) /
          product.price) *
          100,
      )
    : 0;

  // ======================================================
  // PRODUCT IMAGES
  // ======================================================

  const productImages = [
    ...(product.thumbnail ? [product.thumbnail] : []),
    ...(product.gallery || []),
  ].filter(
    (image, index, array) =>
      image && array.indexOf(image) === index,
  );

  const mainImage =
    selectedImage ||
    (productImages.length > 0
      ? `/image/products/${productImages[0]}`
      : "/image/products/sukumart.jpg");

  // ======================================================
  // QUANTITY
  // ======================================================

  const increaseQuantity = () => {
    if (quantity < product.stock) {
      setQuantity((prev) => prev + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  // ======================================================
  // ADD TO CART
  // ======================================================

  const handleAddToCart = () => {
    if (product.variants?.length > 0) {
      const allVariantsSelected = product.variants.every(
        (variant) =>
          selectedVariants[variant.name],
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

      {/* ==================================================
          BREADCRUMB
      ================================================== */}

      <div className="text-sm text-gray-500 mb-6 flex flex-wrap items-center gap-1">

        <Link
          href="/"
          className="hover:text-[#0055B3]"
        >
          Home
        </Link>

        <span className="mx-1">/</span>

        <Link
          href="/shop"
          className="hover:text-[#0055B3]"
        >
          Shop
        </Link>

        {mainCategory?.slug && (
          <>
            <span className="mx-1">/</span>

            <Link
              href={`/categories/${mainCategory.slug}`}
              className="hover:text-[#0055B3]"
            >
              {mainCategory.name}
            </Link>
          </>
        )}

        {subcategory?.slug && (
          <>
            <span className="mx-1">/</span>

            <Link
              href={`/categories/${subcategory.slug}`}
              className="hover:text-[#0055B3]"
            >
              {subcategory.name}
            </Link>
          </>
        )}

        <span className="mx-1">/</span>

        <span className="text-gray-800">
          {product.name}
        </span>
      </div>

      {/* ==================================================
          PRODUCT
      ================================================== */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">

        {/* ==================================================
            PRODUCT GALLERY
        ================================================== */}

        <div className="flex flex-col gap-3">

          {/* MAIN IMAGE */}

          <div className="relative bg-gray-50 rounded-2xl overflow-hidden aspect-square">

            <Image
              src={mainImage}
              alt={product.name || "Product"}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-contain p-6"
              priority
            />

            {/* DISCOUNT */}

            {hasDiscount && (
              <span className="absolute top-2 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-lg">
                -{discountPercentage}%
              </span>
            )}
          </div>

          {/* THUMBNAILS */}

          {productImages.length > 0 && (
            <div className="flex gap-3 overflow-x-auto pb-2">

              {productImages.map((image, index) => {
                const imageUrl =
                  `/image/products/${image}`;

                return (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    onClick={() =>
                      setSelectedImage(imageUrl)
                    }
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
                      sizes="80px"
                      className="object-cover"
                    />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* ==================================================
            PRODUCT INFORMATION
        ================================================== */}

        <div className="flex flex-col">

          {/* CATEGORY */}

          <div className="flex flex-wrap items-center gap-1 text-sm uppercase font-semibold">

            {mainCategory?.slug ? (
              <Link
                href={`/categories/${mainCategory.slug}`}
                className="text-gray-400 hover:text-[#0055B3]"
              >
                {mainCategory.name}
              </Link>
            ) : (
              <span className="text-gray-400">
                Product
              </span>
            )}

            {subcategory && (
              <>
                <span className="text-gray-300">
                  /
                </span>

                <Link
                  href={`/categories/${subcategory.slug}`}
                  className="text-[#0055B3] hover:text-[#002D62]"
                >
                  {subcategory.name}
                </Link>
              </>
            )}
          </div>

          {/* PRODUCT NAME */}

          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 mt-2">
            {product.name}
          </h1>

          {/* RATING */}

          <div className="flex items-center gap-2 mt-4">
            <span className="text-amber-400">
              ★★★★★
            </span>

            <span className="text-sm text-gray-500">
              4.8 (214 reviews)
            </span>
          </div>

          {/* PRICE */}

          <div className="mt-6 flex items-center gap-3 flex-wrap">

            <span className="text-3xl font-extrabold text-[#002D62]">
              Rs. {Number(price).toLocaleString()}
            </span>

            {hasDiscount && (
              <>
                <span className="text-lg text-gray-400 line-through">
                  Rs.{" "}
                  {Number(
                    product.price,
                  ).toLocaleString()}
                </span>

                <span className="bg-red-100 text-red-600 text-sm font-bold px-2 py-1 rounded">
                  -{discountPercentage}%
                </span>
              </>
            )}
          </div>

          {/* STOCK */}

          <div className="mt-5">
            {product.stock > 0 ? (
              <span className="text-green-600 font-semibold">
                ✓ {product.stock} available
              </span>
            ) : (
              <span className="text-red-600 font-semibold">
                Out of stock
              </span>
            )}
          </div>

          {/* DESCRIPTION */}

          <div className="mt-6 border-t pt-6">

            <h2 className="font-bold text-lg mb-2">
              Description
            </h2>

            <p className="text-gray-600 leading-7">
              {product.description ||
                "No description available for this product."}
            </p>
          </div>

          {/* ==================================================
              PRODUCT VARIANTS
          ================================================== */}

          {product.variants?.length > 0 && (
            <div className="mt-6 border-t pt-6 space-y-5">

              <h2 className="font-bold text-lg">
                Select Options
              </h2>

              {product.variants.map(
                (variant, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 flex-wrap"
                  >
                    <p className="font-semibold text-gray-700 mb-2">
                      {variant.name}:
                    </p>

                    <div className="flex flex-wrap gap-2">

                      {variant.options?.map(
                        (
                          option,
                          optionIndex,
                        ) => {
                          const isSelected =
                            selectedVariants[
                              variant.name
                            ] === option;

                          return (
                            <button
                              key={optionIndex}
                              type="button"
                              onClick={() => {
                                setSelectedVariants(
                                  (prev) => ({
                                    ...prev,
                                    [variant.name]:
                                      option,
                                  }),
                                );
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
                        },
                      )}
                    </div>
                  </div>
                ),
              )}
            </div>
          )}

          {/* ==================================================
              QUANTITY
          ================================================== */}

          {product.stock > 0 && (
            <div className="mt-6">

              <p className="font-semibold text-gray-700 mb-2">
                Quantity
              </p>

              <div className="flex items-center border border-gray-300 rounded-lg w-fit">

                <button
                  type="button"
                  onClick={decreaseQuantity}
                  className="px-4 py-2 text-lg hover:bg-gray-100"
                >
                  −
                </button>

                <span className="px-5 py-2 font-semibold">
                  {quantity}
                </span>

                <button
                  type="button"
                  onClick={increaseQuantity}
                  disabled={
                    quantity >= product.stock
                  }
                  className="px-4 py-2 text-lg hover:bg-gray-100 disabled:opacity-40"
                >
                  +
                </button>
              </div>
            </div>
          )}

          {/* ==================================================
              ADD TO CART
          ================================================== */}

          <div className="flex gap-3 mt-8">

            <button
              type="button"
              disabled={product.stock <= 0}
              onClick={handleAddToCart}
              className="flex-1 bg-[#002D62] text-white py-3 rounded-lg font-semibold hover:bg-[#0055B3] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {product.stock > 0
                ? "Add to Cart"
                : "Out of Stock"}
            </button>

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