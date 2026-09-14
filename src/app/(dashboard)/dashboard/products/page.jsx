"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
} from "../../../../Services/Product_Services";
import { getCategories } from "../../../../Services/Category_Service";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);

  // REACT HOOK FORM

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      slug: "",
      price: "",
      stock: "",
      category_id: "",
      thumbnail: "",
      gallery: [],
      description: "",
      variants: [],
    },
  });

  // GET PRODUCTS

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const response = await getProducts();

      if (response.success) {
        setProducts(response.products);
      }
    } catch (error) {
      console.error("Products error:", error);

      toast.error(error.response?.data?.message || "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  // GET CATEGORIES

  const fetchCategories = async () => {
    try {
      const response = await getCategories();

      if (response.success) {
        setCategories(response.categories);
      }
    } catch (error) {
      console.error("Categories error:", error);

      toast.error(
        error.response?.data?.message || "Failed to fetch categories",
      );
    }
  };

  // OPEN ADD MODAL

  const openAddModal = () => {
    setEditId(null);

    reset({
      name: "",
      slug: "",
      price: "",
      stock: "",
      category_id: "",
      thumbnail: "",
      gallery: [],
      description: "",
      variants: [],
    });

    setShowModal(true);
  };

  // OPEN EDIT MODAL

  const openEditModal = (product) => {
    setEditId(product._id);

    reset({
      name: product.name || "",
      slug: product.slug || "",
      price: product.price || "",
      stock: product.stock || "",
      category_id: product.category_id?._id || "",
      thumbnail: product.thumbnail || "",
      gallery: [],
      description: product.description || "",
      variants: product.variants || [],
    });

    setShowModal(true);
  };

  // CREATE / UPDATE PRODUCT

  const onSubmit = async (data) => {
    try {
      setSaving(true);

      const enteredStock = Number(data.stock);

      // =========================
      // ADD PRODUCT
      // =========================
      if (!editId) {
        // Check whether product already exists
        const existingProduct = products.find(
          (product) => product.slug?.toLowerCase() === data.slug?.toLowerCase(),
        );

        // If product already exists → only increase stock
        if (existingProduct) {
          const newStock = Number(existingProduct.stock || 0) + enteredStock;

          const formData = new FormData();

          formData.append("name", existingProduct.name);
          formData.append("slug", existingProduct.slug);
          formData.append("price", existingProduct.price);
          formData.append("stock", newStock);
          formData.append(
            "category_id",
            existingProduct.category_id?._id || "",
          );
          formData.append("description", existingProduct.description || "");
          formData.append(
            "variants",
            JSON.stringify(existingProduct.variants || []),
          );
          formData.append(
            "isFeatured",
            String(existingProduct.isFeatured || false),
          );

          const response = await updateProduct(existingProduct._id, formData);

          if (response.success) {
            toast.success(
              `Product already exists. Stock increased to ${newStock}.`,
            );

            await fetchProducts();

            setShowModal(false);
            reset({
              name: "",
              slug: "",
              price: "",
              stock: "",
              category_id: "",
              thumbnail: "",
              gallery: [],
              description: "",
              variants: [],
            });
          }

          return;
        }
      }

      // =========================
      // NORMAL CREATE / UPDATE
      // =========================

      const formData = new FormData();

      formData.append("name", data.name);
      formData.append("slug", data.slug);
      formData.append("price", Number(data.price));
      formData.append("stock", enteredStock);
      formData.append("category_id", data.category_id || "");
      formData.append("description", data.description || "");
      formData.append("variants", JSON.stringify(data.variants || []));

      if (data.thumbnail?.[0]) {
        formData.append("thumbnail", data.thumbnail[0]);
      }

      if (data.gallery?.length > 0) {
        Array.from(data.gallery).forEach((file) => {
          formData.append("gallery", file);
        });
      }

      let response;

      if (editId) {
        // UPDATE PRODUCT
        response = await updateProduct(editId, formData);
      } else {
        // CREATE PRODUCT
        response = await createProduct(formData);
      }

      if (response.success) {
        toast.success(
          editId
            ? "Product updated successfully"
            : "Product created successfully",
        );

        await fetchProducts();

        setShowModal(false);
        setEditId(null);

        reset({
          name: "",
          slug: "",
          price: "",
          stock: "",
          category_id: "",
          thumbnail: "",
          gallery: [],
          description: "",
          variants: [],
          isFeatured: false,
        });
      }
    } catch (error) {
      console.error("Product save error:", error);

      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  // DELETE PRODUCT

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?",
    );

    if (!confirmDelete) return;

    try {
      const response = await deleteProduct(id);

      if (response.success) {
        toast.success("Product deleted successfully");

        setProducts((prev) => prev.filter((product) => product._id !== id));
      }
    } catch (error) {
      console.error("Delete product error:", error);

      toast.error(error.response?.data?.message || "Failed to delete product");
    }
  };

  //Toggle Featured Product

  const toggleFeatured = async (product, feature) => {
    try {
      const newValue = !product[feature];

      const formData = new FormData();

      formData.append(feature, String(newValue));

      const response = await updateProduct(product._id, formData);
      if (response.success) {
        setProducts((prevProducts) =>
          prevProducts.map((item) =>
            item._id === product._id ? { ...item, [feature]: newValue } : item,
          ),
        );
      }

      toast.success(
        newValue
          ? `${feature} added to featured`
          : `${feature} removed from featured`
      );
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Failed to update featured status",
      );
    }
  };

  // FETCH ON PAGE LOAD

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  return (
    <div>
      {/* ================= HEADER ================= */}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Products</h1>

          <p className="text-sm text-gray-500 mt-1">Manage your products</p>
        </div>

        <button
          onClick={openAddModal}
          className="bg-[#002D62] text-white px-5 py-2.5 rounded-lg hover:bg-[#0055B3]"
        >
          + Add Product
        </button>
      </div>

      {/* ================= TABLE ================= */}

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-gray-500">
            Loading products...
          </div>
        ) : products.length === 0 ? (
          <div className="p-10 text-center text-gray-500">
            No products found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-5 py-4 text-sm">Product</th>

                  <th className="text-left px-5 py-4 text-sm">Category</th>

                  <th className="text-left px-5 py-4 text-sm">Price</th>

                  <th className="text-left px-5 py-4 text-sm">Stock</th>

                  <th className="text-left px-5 py-4 text-sm">Variants</th>

                  <th className="text-center px-5 py-4 text-sm">
                    Product Features
                  </th>

                  <th className="text-left px-5 py-4 text-sm">Action</th>
                </tr>
              </thead>

              <tbody>
                {products.map((product) => (
                  <tr key={product._id} className="border-b last:border-0">
                    {/* PRODUCT */}

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                          <Image
                            src={
                              product.thumbnail
                                ? `/image/products/${product.thumbnail}`
                                : "/image/products/sukumartlogo.jpg"
                            }
                            alt={product.name || "Product"}
                            
                            className="object-cover"
                            width={300}
                            height={300}
                          />
                        </div>

                        <div>
                          <p className="font-semibold text-gray-800">
                            {product.name}
                          </p>

                          <p className="text-xs text-gray-400">
                            {product.slug}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* CATEGORY */}

                    <td className="px-5 py-4 text-sm text-gray-600">
                      {product.category_id?.name || "No category"}
                    </td>

                    {/* PRICE */}

                    <td className="px-5 py-4 font-semibold">
                      Rs. {Number(product.price || 0).toLocaleString()}
                    </td>

                    {/* STOCK */}

                    <td className="px-5 py-4">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          product.stock > 0
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {product.stock > 0
                          ? `${product.stock} available`
                          : "Out of stock"}
                      </span>
                    </td>

                    {/* VARIANTS */}

                    <td className="px-5 py-4">
                      {product.variants?.length > 0 ? (
                        <div className="space-y-1">
                          {product.variants.map((variant, index) => (
                            <div key={index} className="text-sm">
                              <span className="font-medium text-gray-700">
                                {variant.name}:
                              </span>{" "}
                              <span className="text-gray-500">
                                {variant.options?.join(", ")}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">
                          No variants
                        </span>
                      )}
                    </td>

                    {/* FEATURED */}

                    {/* FEATURES */}

                    <td className="px-5 py-4">
                      <div className="flex flex-col gap-2">
                        {/* FEATURED */}
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={product.isFeatured || false}
                            onChange={() =>
                              toggleFeatured(product, "isFeatured")
                            }
                            className="w-4 h-4"
                          />

                          <span className="text-sm text-gray-700">
                            Featured
                          </span>
                        </label>

                        {/* SALE */}
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={product.isSale || false}
                            onChange={() => toggleFeatured(product, "isSale")}
                            className="w-4 h-4"
                          />

                          <span className="text-sm text-gray-700">Sale</span>
                        </label>

                        {/* HOT DEAL */}
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={product.isDeal || false}
                            onChange={() => toggleFeatured(product, "isDeal")}
                            className="w-4 h-4"
                          />

                          <span className="text-sm text-gray-700">
                            Hot Deal
                          </span>
                        </label>
                      </div>
                    </td>

                    {/* ACTION */}

                    <td className="px-5 py-4">
                      <div className="flex gap-3">
                        <button
                          onClick={() => openEditModal(product)}
                          className="text-blue-600 text-sm"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleDelete(product._id)}
                          className="text-red-600 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ================= MODAL ================= */}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-lg rounded-xl p-6 mx-4 max-h-[95vh] overflow-y-auto">
            {/* MODAL HEADER */}

            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-gray-800">
                {editId ? "Edit Product" : "Add Product"}
              </h2>

              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-700 text-xl"
              >
                ×
              </button>
            </div>

            {/* FORM */}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* NAME */}
              <div className="flex items-center justify-between gap-2 lg:gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Name
                  </label>

                  <input
                    type="text"
                    placeholder="e.g. Samsung Galaxy"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                    {...register("name", {
                      required: "Product name is required",
                    })}
                  />

                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* SLUG */}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Slug
                  </label>

                  <input
                    type="text"
                    placeholder="e.g. samsung-galaxy"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                    {...register("slug", {
                      required: "Slug is required",
                      onChange: (e) => {
                        setValue("slug", e.target.value.toLowerCase());
                      },
                    })}
                  />

                  {errors.slug && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.slug.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 lg:gap-4">
                {/* PRICE */}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price
                  </label>

                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 50000"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                    {...register("price", {
                      required: "Price is required",
                      min: {
                        value: 0,
                        message: "Price cannot be negative",
                      },
                    })}
                  />

                  {errors.price && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.price.message}
                    </p>
                  )}
                </div>

                {/* STOCK */}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stock
                  </label>

                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 20"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                    {...register("stock", {
                      required: "Stock is required",
                      min: {
                        value: 0,
                        message: "Stock cannot be negative",
                      },
                    })}
                  />

                  {errors.stock && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.stock.message}
                    </p>
                  )}
                </div>
              </div>

              {/* CATEGORY */}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>

                <select
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                  {...register("category_id", {
                    required: "Please select a category",
                  })}
                >
                  <option value="">Select Category</option>

                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>

                {errors.category_id && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.category_id.message}
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>

                <textarea
                  rows={5}
                  placeholder="Enter product description..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  {...register("description", {
                    required: "Product description is required",
                  })}
                />

                {errors.description && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.description.message}
                  </p>
                )}
              </div>

              {/* VARIANTS */}

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Product Variants
                  </label>

                  <button
                    type="button"
                    onClick={() => {
                      const currentVariants = watch("variants") || [];

                      setValue("variants", [
                        ...currentVariants,
                        {
                          name: "",
                          options: [],
                        },
                      ]);
                    }}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    + Add Variant
                  </button>
                </div>

                {(watch("variants") || []).map((variant, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4 mb-3"
                  >
                    <div className="flex gap-3 items-start">
                      {/* Variant Name */}

                      <div className="flex-1">
                        <label className="block text-xs text-gray-500 mb-1">
                          Variant Name
                        </label>

                        <input
                          type="text"
                          placeholder="e.g. Color"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2"
                          value={variant.name}
                          onChange={(e) => {
                            const variants = [...watch("variants")];

                            variants[index] = {
                              ...variants[index],
                              name: e.target.value,
                            };

                            setValue("variants", variants);
                          }}
                        />
                      </div>

                      {/* Variant Options */}

                      <div className="flex-1">
                        <label className="block text-xs text-gray-500 mb-1">
                          Options
                        </label>

                        <input
                          type="text"
                          placeholder="e.g. Black, White, Blue"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2"
                          value={variant.options.join(", ")}
                          onChange={(e) => {
                            const options = e.target.value
                              .split(",")
                              .map((option) => option.trim())
                              .filter(Boolean);

                            const variants = [...watch("variants")];

                            variants[index] = {
                              ...variants[index],
                              options,
                            };

                            setValue("variants", variants);
                          }}
                        />
                      </div>

                      {/* Remove Variant */}

                      <button
                        type="button"
                        onClick={() => {
                          const variants = [...watch("variants")];

                          variants.splice(index, 1);

                          setValue("variants", variants);
                        }}
                        className="text-red-500 mt-6"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between gap-2 lg:gap-4">
                {/* THUMBNAIL */}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Thumbnail
                  </label>

                  <input
                    type="file"
                    placeholder="jpg"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                    {...register("thumbnail", {
                      required: !editId ? "Product image is required" : false,
                    })}
                  />
                  {errors.thumbnail && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.thumbnail.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gallery
                  </label>

                  <input
                    type="file"
                    placeholder="jpg"
                    multiple
                    accept="image/*"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                    {...register("gallery")}
                  />
                  {errors.gallery && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.gallery.message}
                    </p>
                  )}
                </div>
              </div>

              {/* BUTTONS */}

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-[#002D62] text-white rounded-lg hover:bg-[#0055B3] disabled:opacity-50"
                >
                  {saving
                    ? "Saving..."
                    : editId
                      ? "Update Product"
                      : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
