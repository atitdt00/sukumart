"use client";

import CategoryImport from "../../../../Components/dashboard/CategoryImport";
import ProductImport from "../../../../Components/dashboard/ProductImport";

export default function ImportPage() {
  return (
    <div className="space-y-8 p-6">
      <div>
        <h1 className="text-2xl font-bold text-[#002D62]">
          Import Data
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Import WooCommerce data into SukuMart.
        </p>
      </div>

      <CategoryImport />

      <ProductImport />
    </div>
  );
}