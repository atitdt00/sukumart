"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import {
  previewCategories,
  importCategoriesCsv,
} from "../../Services/Import_Service";
import ImportPreview from "./ImportPreview";

export default function CategoryImport({
  onImportComplete,
}) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    if (
      !selectedFile.name
        .toLowerCase()
        .endsWith(".csv")
    ) {
      toast.error("Please select a CSV file");
      return;
    }

    setFile(selectedFile);
    setPreview([]);
    setShowPreview(false);
  };

  const handlePreview = async () => {
    if (!file) {
      toast.error("Please select a CSV file");
      return;
    }

    try {
      setLoading(true);

      const response = await previewCategories(file);

      if (!response?.success) {
        toast.error(
          response?.message ||
            "Unable to preview CSV"
        );
        return;
      }

      if (response.errors?.length > 0) {
        response.errors.forEach((error) => {
          toast.error(
            `Row ${error.row}: ${error.message}`
          );
        });
      }

      setPreview(response.categories || []);
      setShowPreview(true);
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to preview CSV"
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
        await importCategoriesCsv(file);

      if (!response?.success) {
        toast.error(
          response?.message ||
            "Category import failed"
        );
        return;
      }

      const summary = response.summary;

      toast.success(
        `Import completed. Created: ${summary.created}, Skipped: ${summary.skipped}, Failed: ${summary.failed}`
      );

      if (response.errors?.length > 0) {
        console.warn(
          "Category import errors:",
          response.errors
        );
      }

      setFile(null);
      setPreview([]);
      setShowPreview(false);

      /*
       * Refresh categories page
       */
      if (onImportComplete) {
        onImportComplete(response);
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to import categories"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setPreview([]);
    setShowPreview(false);
  };

  return (
    <div className="w-full rounded-xl border bg-white p-5 shadow-sm">
      <div className="mb-5">
        <h2 className="text-xl font-semibold text-[#002D62]">
          Import Categories
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Upload your WooCommerce categories CSV
          file.
        </p>
      </div>

      {!showPreview && (
        <>
          <div className="rounded-lg border-2 border-dashed p-8 text-center">
            <input
              id="category-csv"
              type="file"
              accept=".csv,text/csv"
              onChange={handleFileChange}
              className="hidden"
            />

            <label
              htmlFor="category-csv"
              className="inline-flex cursor-pointer rounded-lg bg-[#002D62] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#0055B3]"
            >
              Choose CSV File
            </label>

            {file && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700">
                  {file.name}
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  {(file.size / 1024).toFixed(2)} KB
                </p>
              </div>
            )}
          </div>

          <div className="mt-5 flex justify-end">
            <button
              type="button"
              onClick={handlePreview}
              disabled={!file || loading}
              className="rounded-lg bg-[#002D62] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#0055B3] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Reading CSV..."
                : "Preview CSV"}
            </button>
          </div>
        </>
      )}

      {showPreview && (
        <ImportPreview
          categories={preview}
          onConfirm={handleImport}
          onCancel={handleCancel}
          loading={loading}
        />
      )}
    </div>
  );
}