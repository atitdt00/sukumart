"use client";

import { useEffect, useState } from "react";
import DashboardCard from "../../../Components/dashboard/DashboardCard";
import { getDashboardStats } from "../../../Services/Dashboard_Service";
import { toast } from "react-toastify";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    users: 0,
  });

  const [loading, setLoading] = useState(true);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true)
      const data = await getDashboardStats();

      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Dashboard API error:", error);
      toast.error(error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">
          Dashboard
        </h1>

        <p className="text-gray-500 mt-1">
          Welcome to SukuMart dashboard
        </p>
      </div>

      {loading ? (
        <p className="text-gray-500">
          Loading...
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

          <DashboardCard
            title="Total Products"
            value={stats.products}
            icon="📦"
          />

          <DashboardCard
            title="Total Categories"
            value={stats.categories}
            icon="📂"
          />

          <DashboardCard
            title="Total Users"
            value={stats.users}
            icon="👥"
          />

        </div>
      )}
    </div>
  );
}