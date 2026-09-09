"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { createCategory, deleteCategory, getCategories, updateCategory } from "../../../../Services/Category_Service";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editSlug, setEditSlug] = useState(null);

  // REACT HOOK FORM
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({ defaultValues: { name: "", slug: "", parent_id: "" } });
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await getCategories();

      setCategories(response.categories || []);
    } catch (error) {
      console.error("Categories error:", error);
    } finally {
      setLoading(false);
    }
  };

  //create and update Category
  const onSubmit = async (data) => {
    try {
      setSaving(true);
      const categoryData = {
        name: data.name,
        slug: data.slug,
        parent_id: data.parent_id || null,
      };
      let response;
      if (editSlug) {
        response = await updateCategory(editSlug, categoryData);
      } else {
        response = await createCategory(categoryData);
      }

      if (response.success) {
        toast.success(
          editSlug
            ? "Category updated successfully"
            : "Category created successfully",
        );
      }
      await fetchCategories();
      setShowModal(false);
      reset({
        name: "",
        slug: "",
        parent_id: "",
      });

      setEditSlug(null);
    } catch (error) {
      const message = error.response?.data?.message || "something went wrong";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  //delete Category
  const handleDelete = async (slug) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this Category?",
    );
    if (!confirmDelete) return;
    try {
      const response = await deleteCategory(slug);
      if (response.success) {
        toast.success("Category deleted successfully");

        setCategories((prev) => prev.filter((category) => category.slug !== slug));
      }
    } catch (error) {
      toast.error(error.response?.data.message || " Failed to delete category");
    }
  };

  // ========================= // OPEN ADD MODAL // ========================= //
  const openAddModal = () => {
    setEditSlug(null);
    reset({ name: "", slug: "", parent_id: "" });
    setShowModal(true);
  };

  // ========================= // OPEN EDIT MODAL // ========================= //
  const openEditModal = (category) => {
    setEditSlug(category.slug);
    reset({
      name: category.name || "",
      slug: category.slug || "",
      parent_id: category.parent_id?._id || "",
    });
    setShowModal(true);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Categories</h1>

          <p className="text-sm text-gray-500 mt-1">
            Manage product categories
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="bg-[#002D62] text-white px-5 py-2.5 rounded-lg hover:bg-[#0055B3]"
        >
          + Add Category
        </button>
      </div>
      {/* Category Table */}
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
                  <th className="text-left px-5 py-4 text-sm">Name</th>

                  <th className="text-left px-5 py-4 text-sm">Slug</th>

                  <th className="text-left px-5 py-4 text-sm">Category</th>

                  <th className="text-left px-5 py-4 text-sm">Created</th>

                  <th className="text-left px-5 py-4 text-sm">Action</th>
                </tr>
              </thead>

              <tbody>
                {categories.map((category) => (
                  <tr key={category._id} className="border-b last:border-0">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-gray-800">
                        {category.name}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-500">
                      {category.slug}
                    </td>

                    <td className="px-5 py-4 text-sm">
                      {category.name || "Main Category"}
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-500">
                      {category.createdAt
                        ? new Date(category.createdAt).toLocaleDateString()
                        : "-"}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex gap-3">
                        <button
                          onClick={() => openEditModal(category)}
                          className="text-blue-600 text-sm"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleDelete(category.slug)}
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
      {/* ================= MODAL ================= */}{" "}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          {" "}
          <div className="bg-white w-full max-w-md rounded-xl p-6 mx-4">
            {" "}
            {/* MODAL HEADER */}{" "}
            <div className="flex items-center justify-between mb-5">
              {" "}
              <h2 className="text-xl font-bold text-gray-800">
                {" "}
                {editSlug ? "Edit Category" : "Add Category"}{" "}
              </h2>{" "}
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-700 text-xl"
              >
                {" "}
                ×{" "}
              </button>{" "}
            </div>{" "}
            {/* FORM */}{" "}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {" "}
              {/* NAME */}{" "}
              <div>
                {" "}
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {" "}
                  Category Name{" "}
                </label>{" "}
                <input
                  {...register("name", {
                    required: "Category name is required",
                  })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>{" "}
              {/* SLUG */}{" "}
              <div>
                {" "}
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {" "}
                  Slug{" "}
                </label>{" "}
                <input
                  type="text"
                  placeholder="e.g. electronics"
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
              </div>{" "}
              {/* PARENT CATEGORY */}{" "}
              <div>
                {" "}
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {" "}
                  Parent Category{" "}
                </label>{" "}
                <select
                  {...register("parent_id")}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none"
                >
                  {" "}
                  <option value=""> Main Category </option>{" "}
                  {categories
                    .filter((category) => category._id !== editSlug)
                    .map((category) => (
                      <option key={category._id} value={category._id}>
                        {" "}
                        {category.name}{" "}
                      </option>
                    ))}{" "}
                </select>{" "}
              </div>{" "}
              {/* BUTTONS */}{" "}
              <div className="flex justify-end gap-3 pt-3">
                {" "}
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100"
                >
                  {" "}
                  Cancel{" "}
                </button>{" "}
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-[#002D62] text-white rounded-lg hover:bg-[#0055B3] disabled:opacity-50"
                >
                  {" "}
                  {saving
                    ? "Saving..."
                    : editSlug
                      ? "Update Category"
                      : "Create Category"}{" "}
                </button>{" "}
              </div>{" "}
            </form>{" "}
          </div>{" "}
        </div>
      )}
    </div>
  );
}
