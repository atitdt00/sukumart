"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { getUsers } from "../../../../Services/User_Service";

const API = process.env.NEXT_PUBLIC_API_URL || "";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);

  // REACT HOOK FORM

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      role: "customer",
    },
  });

  // GET USERS

  const fetchUsers = async () => {
    try {
      const response = await getUsers();

      if (response.success) {
        setUsers(response.users);
      }
    } catch (error) {
      console.error("Users error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to fetch users"
      );
    } finally {
      setLoading(false);
    }
  };

  // OPEN ADD MODAL

  const openAddModal = () => {
    setEditId(null);

    reset({
      fullName: "",
      email: "",
      password: "",
      role: "customer",
    });

    setShowModal(true);
  };

  // OPEN EDIT MODAL

  const openEditModal = (user) => {
    setEditId(user._id);

    reset({
      fullName: user.fullName || "",
      email: user.email || "",
      password: "",
      role: user.role || "customer",
    });

    setShowModal(true);
  };

  // =========================
  // CREATE / UPDATE USER
  // =========================

  const onSubmit = async (data) => {
    try {
      setSaving(true);

      const userData = {
        fullName: data.fullName,
        email: data.email,
        role: data.role,
      };

      // Password is required only when creating
      if (!editId) {
        userData.password = data.password;
      }

      // If editing and password is entered,
      // send the new password
      if (editId && data.password) {
        userData.password = data.password;
      }

      let response;

      // UPDATE
      if (editId) {
        response = await axios.put(
          `${API}/api/users/${editId}`,
          userData
        );
      }

      // CREATE
      else {
        response = await axios.post(
          `${API}/api/users`,
          userData
        );
      }

      if (response.data.success) {
        toast.success(
          editId
            ? "User updated successfully"
            : "User created successfully"
        );

        await fetchUsers();

        setShowModal(false);
        setEditId(null);

        reset({
          fullName: "",
          email: "",
          password: "",
          role: "customer",
        });
      }
    } catch (error) {
      console.error("User save error:", error);

      toast.error(
        error.response?.data?.message ||
          "Something went wrong"
      );
    } finally {
      setSaving(false);
    }
  };

  // DELETE USER

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmDelete) return;

    try {
      const response = await axios.delete(
        `${API}/api/users/${id}`
      );

      if (response.data.success) {
        toast.success(
          "User deleted successfully"
        );

        setUsers((prev) =>
          prev.filter(
            (user) => user._id !== id
          )
        );
      }
    } catch (error) {
      console.error(
        "Delete user error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to delete user"
      );
    }
  };

  // =========================
  // FETCH USERS ON PAGE LOAD
  // =========================

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      {/* ================= HEADER ================= */}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Users
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Manage SukuMart users
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="bg-[#002D62] text-white px-5 py-2.5 rounded-lg hover:bg-[#0055B3]"
        >
          + Add User
        </button>
      </div>

      {/* ================= USERS TABLE ================= */}

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-gray-500">
            Loading users...
          </div>
        ) : users.length === 0 ? (
          <div className="p-10 text-center text-gray-500">
            No users found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-5 py-4 text-sm">
                    fullName
                  </th>

                  <th className="text-left px-5 py-4 text-sm">
                    Email
                  </th>

                  <th className="text-left px-5 py-4 text-sm">
                    Role
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
                {users.map((user) => (
                  <tr
                    key={user._id}
                    className="border-b last:border-0"
                  >
                    {/* NAME */}

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-[#0055B3] font-bold">
                          {user.fullName
                            ?.charAt(0)
                            .toUpperCase() || "U"}
                        </div>

                        <span className="font-semibold text-gray-800">
                          {user.fullName}
                        </span>
                      </div>
                    </td>

                    {/* EMAIL */}

                    <td className="px-5 py-4 text-sm text-gray-600">
                      {user.email}
                    </td>

                    {/* ROLE */}

                    <td className="px-5 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          user.role === "admin"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>

                    {/* CREATED */}

                    <td className="px-5 py-4 text-sm text-gray-500">
                      {user.createdAt
                        ? new Date(
                            user.createdAt
                          ).toLocaleDateString()
                        : "-"}
                    </td>

                    {/* ACTION */}

                    <td className="px-5 py-4">
                      <div className="flex gap-3">
                        <button
                          onClick={() =>
                            openEditModal(user)
                          }
                          className="text-blue-600 text-sm"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() =>
                            handleDelete(
                              user._id
                            )
                          }
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
          <div className="bg-white w-full max-w-md rounded-xl p-6 mx-4">
            {/* MODAL HEADER */}

            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-gray-800">
                {editId
                  ? "Edit User"
                  : "Add User"}
              </h2>

              <button
                type="button"
                onClick={() =>
                  setShowModal(false)
                }
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
                  fullName
                </label>

                <input
                  type="text"
                  placeholder="e.g. Atit"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                  {...register("fullName", {
                    required:
                      "fullName is required",
                  })}
                />

                {errors.fullName && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              {/* EMAIL */}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>

                <input
                  type="email"
                  placeholder="e.g. user@gmail.com"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                  {...register("email", {
                    required:
                      "Email is required",
                    pattern: {
                      value:
                        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message:
                        "Enter a valid email",
                    },
                  })}
                />

                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* PASSWORD */}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                  {editId && (
                    <span className="text-gray-400 ml-1">
                      (optional)
                    </span>
                  )}
                </label>

                <input
                  type="password"
                  placeholder={
                    editId
                      ? "Enter new password"
                      : "Enter password"
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                  {...register("password", {
                    required: editId
                      ? false
                      : "Password is required",
                    minLength: {
                      value: 6,
                      message:
                        "Password must be at least 6 characters",
                    },
                  })}
                />

                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* ROLE */}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>

                <select
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                  {...register("role", {
                    required:
                      "Role is required",
                  })}
                >
                  <option value="customer">
                    Customer
                  </option>

                  <option value="admin">
                    Admin
                  </option>
                </select>

                {errors.role && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.role.message}
                  </p>
                )}
              </div>

              {/* BUTTONS */}

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() =>
                    setShowModal(false)
                  }
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
                    ? "Update User"
                    : "Create User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}