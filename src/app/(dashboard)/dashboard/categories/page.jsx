"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "../../../../Services/Category_Service";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editSlug, setEditSlug] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      slug: "",
      parent_id: "",
      image: null,
    },
  });

  // --------------------------------------------------
  // MAIN CATEGORIES
  // --------------------------------------------------
  const mainCategories = useMemo(() => {
    return categories.filter((category) => !category.parent_id);
  }, [categories]);

  // --------------------------------------------------
  // SUBCATEGORIES
  // --------------------------------------------------
  const subCategories = useMemo(() => {
    return categories.filter((category) => category.parent_id);
  }, [categories]);

  // --------------------------------------------------
  // FETCH CATEGORIES
  // --------------------------------------------------
  const fetchCategories = async () => {
    try {
      setLoading(true);

      const response = await getCategories();

      setCategories(response.categories || []);
    } catch (error) {
      console.error("Categories error:", error);
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // CREATE / UPDATE CATEGORY
  // --------------------------------------------------
  const onSubmit = async (data) => {
    try {
      setSaving(true);

      // ----------------------------------------------
      // CREATE FORMDATA
      // ----------------------------------------------
      const formData = new FormData();

      formData.append("name", data.name.trim());
      formData.append("slug", data.slug.trim().toLowerCase());

      if (data.parent_id) {
        formData.append("parent_id", data.parent_id);
      } else {
        formData.append("parent_id", "");
      }

      // Add image only when a new image is selected
      if (data.image?.[0]) {
        formData.append("image", data.image[0]);
      }

      let response;

      if (editSlug) {
        response = await updateCategory(editSlug, formData);
      } else {
        response = await createCategory(formData);
      }

      if (!response.success) {
        toast.error(response.message || "Something went wrong");
        return;
      }

      toast.success(
        editSlug
          ? "Category updated successfully"
          : data.parent_id
            ? "Subcategory created successfully"
            : "Main category created successfully",
      );

      await fetchCategories();

      closeModal();
    } catch (error) {
      console.error("Category save error:", error);

      const message =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong";

      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  // --------------------------------------------------
  // DELETE CATEGORY
  // --------------------------------------------------
  const handleDelete = async (slug) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this category?",
    );

    if (!confirmDelete) return;

    try {
      const response = await deleteCategory(slug);

      if (response.success) {
        toast.success("Category deleted successfully");

        setCategories((prev) =>
          prev.filter((category) => category.slug !== slug),
        );
      } else {
        toast.error(response.message || "Failed to delete category");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to delete category",
      );
    }
  };

  // --------------------------------------------------
  // OPEN ADD MODAL
  // --------------------------------------------------
  const openAddModal = () => {
    setEditSlug(null);

    reset({
      name: "",
      slug: "",
      parent_id: "",
      image: null,
    });

    setShowModal(true);
  };

  // --------------------------------------------------
  // OPEN EDIT MODAL
  // --------------------------------------------------
  const openEditModal = (category) => {
    setEditSlug(category.slug);

    reset({
      name: category.name || "",
      slug: category.slug || "",
      parent_id: category.parent_id?._id || "",
      image: null,
    });

    setShowModal(true);
  };

  // --------------------------------------------------
  // CLOSE MODAL
  // --------------------------------------------------
  const closeModal = () => {
    setShowModal(false);
    setEditSlug(null);

    reset({
      name: "",
      slug: "",
      parent_id: "",
      image: null,
    });
  };

  // --------------------------------------------------
  // GET PARENT NAME
  // --------------------------------------------------
  const getParentName = (category) => {
    if (!category.parent_id) {
      return null;
    }

    // API populated parent_id
    if (typeof category.parent_id === "object") {
      return category.parent_id.name;
    }

    // Fallback if parent_id is only an ObjectId
    const parent = categories.find(
      (item) => item._id === category.parent_id,
    );

    return parent?.name || null;
  };

  // --------------------------------------------------
  // GET IMAGE URL
  // --------------------------------------------------
  const getCategoryImage = (category) => {
    if (!category.image) {
      return null;
    }

    // Cloudinary image
    if (category.image.startsWith("http")) {
      return category.image;
    }

    // Old/local image
    return `/image/categories/${category.image}`;
  };

  // --------------------------------------------------
  // LOAD DATA
  // --------------------------------------------------
  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div>
      {/* ================= HEADER ================= */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Categories
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Manage main categories and subcategories
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="bg-[#002D62] text-white px-5 py-2.5 rounded-lg hover:bg-[#0055B3] transition"
        >
          + Add Category
        </button>
      </div>

      {/* ================= CATEGORY SUMMARY ================= */}
      {!loading && categories.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white border border-gray-100 rounded-xl p-4">
            <p className="text-sm text-gray-500">Total Categories</p>

            <p className="text-2xl font-bold text-[#002D62] mt-1">
              {categories.length}
            </p>
          </div>

          <div className="bg-white border border-gray-100 rounded-xl p-4">
            <p className="text-sm text-gray-500">Main Categories</p>

            <p className="text-2xl font-bold text-[#002D62] mt-1">
              {mainCategories.length}
            </p>
          </div>

          <div className="bg-white border border-gray-100 rounded-xl p-4">
            <p className="text-sm text-gray-500">Subcategories</p>

            <p className="text-2xl font-bold text-[#002D62] mt-1">
              {subCategories.length}
            </p>
          </div>
        </div>
      )}

      {/* ================= CATEGORY TABLE ================= */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-gray-500">
            Loading categories...
          </div>
        ) : categories.length === 0 ? (
          <div className="p-10 text-center text-gray-500">
            No categories found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-5 py-4 text-sm">
                    Image
                  </th>

                  <th className="text-left px-5 py-4 text-sm">
                    Name
                  </th>

                  <th className="text-left px-5 py-4 text-sm">
                    Slug
                  </th>

                  <th className="text-left px-5 py-4 text-sm">
                    Type
                  </th>

                  <th className="text-left px-5 py-4 text-sm">
                    Parent Category
                  </th>

                  <th className="text-left px-5 py-4 text-sm">
                    Created
                  </th>

                  <th className="text-left px-5 py-4 text-sm">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {categories.map((category) => {
                  const parentName = getParentName(category);
                  const isSubcategory = Boolean(category.parent_id);
                  const imageUrl = getCategoryImage(category);

                  return (
                    <tr
                      key={category._id}
                      className="border-b last:border-0 hover:bg-gray-50"
                    >
                      {/* IMAGE */}
                      <td className="px-5 py-4">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={category.name}
                            className="w-12 h-12 object-cover rounded-lg border border-gray-200"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-xs text-gray-400">
                            No Image
                          </div>
                        )}
                      </td>

                      {/* NAME */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          {isSubcategory && (
                            <span className="text-gray-400">
                              ↳
                            </span>
                          )}

                          <p className="font-semibold text-gray-800">
                            {category.name}
                          </p>
                        </div>
                      </td>

                      {/* SLUG */}
                      <td className="px-5 py-4 text-sm text-gray-500">
                        {category.slug}
                      </td>

                      {/* TYPE */}
                      <td className="px-5 py-4 text-sm">
                        {isSubcategory ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold">
                            Subcategory
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-yellow-50 text-[#002D62] text-xs font-semibold">
                            Main Category
                          </span>
                        )}
                      </td>

                      {/* PARENT */}
                      <td className="px-5 py-4 text-sm text-gray-600">
                        {parentName || (
                          <span className="text-gray-400">
                            —
                          </span>
                        )}
                      </td>

                      {/* CREATED */}
                      <td className="px-5 py-4 text-sm text-gray-500">
                        {category.createdAt
                          ? new Date(
                              category.createdAt,
                            ).toLocaleDateString()
                          : "-"}
                      </td>

                      {/* ACTION */}
                      <td className="px-5 py-4">
                        <div className="flex gap-3">
                          <button
                            onClick={() =>
                              openEditModal(category)
                            }
                            className="text-blue-600 text-sm hover:text-blue-800"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() =>
                              handleDelete(category.slug)
                            }
                            className="text-red-600 text-sm hover:text-red-800"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ================= MODAL ================= */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-xl p-6 mx-4 max-h-[90vh] overflow-y-auto">
            {/* MODAL HEADER */}
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  {editSlug ? "Edit Category" : "Add Category"}
                </h2>

                <p className="text-xs text-gray-500 mt-1">
                  {editSlug
                    ? "Update category information"
                    : "Create a main category or subcategory"}
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-700 text-xl"
              >
                ×
              </button>
            </div>

            {/* FORM */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4"
            >
              {/* NAME */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category Name
                </label>

                <input
                  {...register("name", {
                    required: "Category name is required",
                  })}
                  placeholder="e.g. Electronics"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
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
                  placeholder="e.g. electronics"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                  {...register("slug", {
                    required: "Slug is required",

                    onChange: (e) => {
                      setValue(
                        "slug",
                        e.target.value.toLowerCase(),
                      );
                    },
                  })}
                />

                {errors.slug && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.slug.message}
                  </p>
                )}
              </div>

              {/* PARENT CATEGORY */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Parent Category
                </label>

                <select
                  {...register("parent_id")}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Main Category</option>

                  {mainCategories
                    .filter(
                      (category) =>
                        category.slug !== editSlug,
                    )
                    .map((category) => (
                      <option
                        key={category._id}
                        value={category._id}
                      >
                        {category.name}
                      </option>
                    ))}
                </select>

                <p className="text-xs text-gray-400 mt-1">
                  Leave this as "Main Category" to create a
                  top-level category.
                </p>
              </div>

              {/* IMAGE */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category Image
                </label>

                <input
                  type="file"
                  accept="image/*"
                  {...register("image")}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />

                <p className="text-xs text-gray-400 mt-1">
                  {editSlug
                    ? "Select a new image only if you want to replace the current image."
                    : "Upload a category image. Maximum size: 5MB."}
                </p>

                {/* CURRENT IMAGE ON EDIT */}
                {editSlug &&
                  categories.find(
                    (category) => category.slug === editSlug,
                  )?.image && (
                    <div className="mt-3">
                      <p className="text-xs text-gray-500 mb-2">
                        Current Image
                      </p>

                      <img
                        src={getCategoryImage(
                          categories.find(
                            (category) =>
                              category.slug === editSlug,
                          ),
                        )}
                        alt="Current category"
                        className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                      />
                    </div>
                  )}
              </div>

              {/* BUTTONS */}
              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={closeModal}
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
                    : editSlug
                      ? "Update Category"
                      : "Create Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}