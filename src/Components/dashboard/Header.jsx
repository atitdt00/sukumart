"use client";

import { toast } from "react-toastify";
import { getCurrentUser, logoutUser } from "../../Services/Auth_Service";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();

  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(false);

  // =========================
  // GET CURRENT ADMIN
  // =========================

  const checkAdmin = async () => {
    try {
      setLoading(true);

      const response = await getCurrentUser();

      if (response?.success && response?.user?.role === "admin") {
        setAdmin(response.user);
      } else {
        setAdmin(null);
      }
    } catch (error) {
      console.error("Admin auth error:", error);
      setAdmin(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await logoutUser();

      if (response?.success) {
        toast.success("Logout successfully");

        setAdmin(null);

        router.push("/");
        router.refresh();

        return;
      }
    } catch (error) {
      console.error("Logout Error", error);
      toast.error("Logout Failed");
    }
  };

  useEffect(() => {
    checkAdmin();
  }, []);

  const adminName = admin?.name || "Admin";

  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-6">
      <h2 className="text-lg font-semibold text-gray-800">Admin Dashboard</h2>

      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-600">
          {" "}
          {loading ? adminName : "Admin"}
        </span>

        <div className="w-9 h-9 rounded-full bg-[#0055B3] text-white flex items-center justify-center">
          <span className="font-medium">
            {adminName.charAt(0).toUpperCase()}
          </span>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition"
        >
          {" "}
          <i className="fa-solid fa-right-from-bracket"></i>{" "}
          <span className="text-sm font-medium"> Logout </span>{" "}
        </button>
      </div>
    </header>
  );
}
