"use client";

export default function DashboardCard({
  title,
  value,
  icon,
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
      <div className="flex items-center justify-between">
        
        <div>
          <p className="text-sm text-gray-500">
            {title}
          </p>

          <h2 className="text-3xl font-bold text-gray-800 mt-2">
            {value}
          </h2>
        </div>

        <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-xl">
          {icon}
        </div>

      </div>
    </div>
  );
}