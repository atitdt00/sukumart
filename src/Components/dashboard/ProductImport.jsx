"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import {
  previewProducts,
  importProductsCsv,
} from "../../Services/Import_Service";

export default function ProductImport({
  onImportComplete,
}) {
  const [file, setFile] =
    useState(null);

  const [products, setProducts] =
    useState([]);

  const [showPreview, setShowPreview] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const handleFileChange = (
    event
  ) => {
    const selectedFile =
      event.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    if (
      !selectedFile.name
        .toLowerCase()
        .endsWith(".csv")
    ) {
      toast.error(
        "Please select a CSV file"
      );

      return;
    }

    setFile(selectedFile);
    setProducts([]);
    setShowPreview(false);
  };

  const handlePreview = async () => {
    if (!file) {
      toast.error(
        "Please select a CSV file"
      );

      return;
    }

    try {
      setLoading(true);

      const response =
        await previewProducts(file);

      if (!response?.success) {
        toast.error(
          response?.message ||
            "Preview failed"
        );

        return;
      }

      setProducts(
        response.products || []
      );

      setShowPreview(true);
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to preview products"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async () => {
    if (!file) {
      return;
    }

    try {
      setLoading(true);

      const response =
        await importProductsCsv(
          file
        );

      if (!response?.success) {
        toast.error(
          response?.message ||
            "Product import failed"
        );

        return;
      }

      const summary =
        response.summary;

      toast.success(
        `Created: ${summary.created}, Updated: ${summary.updated}, Failed: ${summary.failed}`
      );

      if (
        response.errors?.length
      ) {
        console.warn(
          "Product import errors:",
          response.errors
        );
      }

      setFile(null);
      setProducts([]);
      setShowPreview(false);

      if (onImportComplete) {
        onImportComplete(
          response
        );
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to import products"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setProducts([]);
    setShowPreview(false);
  };

  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <div className="mb-5">
        <h2 className="text-xl font-semibold text-[#002D62]">
          Import Products
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Upload your WooCommerce products
          CSV file.
        </p>
      </div>

      {!showPreview && (
        <>
          <div className="rounded-lg border-2 border-dashed p-8 text-center">
            <input
              id="product-csv"
              type="file"
              accept=".csv,text/csv"
              onChange={
                handleFileChange
              }
              className="hidden"
            />

            <label
              htmlFor="product-csv"
              className="inline-flex cursor-pointer rounded-lg bg-[#002D62] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#0055B3]"
            >
              Choose CSV File
            </label>

            {file && (
              <div className="mt-4">
                <p className="text-sm font-medium">
                  {file.name}
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  {(
                    file.size / 1024
                  ).toFixed(2)}{" "}
                  KB
                </p>
              </div>
            )}
          </div>

          <div className="mt-5 flex justify-end">
            <button
              type="button"
              disabled={
                !file || loading
              }
              onClick={
                handlePreview
              }
              className="rounded-lg bg-[#002D62] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#0055B3] disabled:opacity-50"
            >
              {loading
                ? "Reading CSV..."
                : "Preview CSV"}
            </button>
          </div>
        </>
      )}

      {showPreview && (
        <div>
          <div className="mb-4">
            <h3 className="text-lg font-semibold">
              Product Preview
            </h3>

            <p className="text-sm text-gray-500">
              {products.length} products
              found
            </p>
          </div>

          <div className="max-h-[500px] overflow-auto rounded-lg border">
            <table className="w-full min-w-[1100px] text-sm">
              <thead className="sticky top-0 bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left">
                    Row
                  </th>

                  <th className="px-4 py-3 text-left">
                    Product
                  </th>

                  <th className="px-4 py-3 text-left">
                    SKU
                  </th>

                  <th className="px-4 py-3 text-left">
                    Price
                  </th>

                  <th className="px-4 py-3 text-left">
                    Sale
                  </th>

                  <th className="px-4 py-3 text-left">
                    Stock
                  </th>

                  <th className="px-4 py-3 text-left">
                    Category
                  </th>

                  <th className="px-4 py-3 text-left">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {products.map(
                  (product) => {
                    const category =
                      product.categories?.[0];

                    return (
                      <tr
                        key={`${product.row}-${product.slug}`}
                        className="border-t"
                      >
                        <td className="px-4 py-3">
                          {product.row}
                        </td>

                        <td className="px-4 py-3 font-medium">
                          {product.name}
                        </td>

                        <td className="px-4 py-3">
                          {product.sku ||
                            "-"}
                        </td>

                        <td className="px-4 py-3">
                          Rs.{" "}
                          {product.price}
                        </td>

                        <td className="px-4 py-3">
                          {product.discountPrice ||
                            "-"}
                        </td>

                        <td className="px-4 py-3">
                          {product.stock}
                        </td>

                        <td className="px-4 py-3">
                          {category?.name ||
                            "Not found"}
                        </td>

                        <td className="px-4 py-3">
                          {category?.found ? (
                            <span className="text-green-600">
                              Ready
                            </span>
                          ) : (
                            <span className="text-red-600">
                              Category missing
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-5 flex justify-end gap-3">
            <button
              type="button"
              onClick={
                handleCancel
              }
              disabled={loading}
              className="rounded-lg border px-5 py-2.5 text-sm font-medium hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={
                handleImport
              }
              disabled={
                loading ||
                products.length === 0
              }
              className="rounded-lg bg-[#002D62] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#0055B3] disabled:opacity-50"
            >
              {loading
                ? "Importing..."
                : "Confirm Import"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}