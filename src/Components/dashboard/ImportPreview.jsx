"use client";

export default function ImportPreview({
  categories = [],
  onConfirm,
  onCancel,
  loading = false,
}) {
  if (!categories.length) {
    return (
      <div className="p-6 text-center text-gray-500">
        No data available for preview.
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-[#002D62]">
            Import Preview
          </h3>

          <p className="text-sm text-gray-500">
            {categories.length} categories found
          </p>
        </div>
      </div>

      <div className="max-h-[400px] overflow-auto rounded-lg border">
        <table className="w-full min-w-[600px] text-sm">
          <thead className="sticky top-0 bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left">
                Row
              </th>

              <th className="px-4 py-3 text-left">
                Name
              </th>

              <th className="px-4 py-3 text-left">
                Slug
              </th>

              <th className="px-4 py-3 text-left">
                Parent
              </th>
            </tr>
          </thead>

          <tbody>
            {categories.map((category) => (
              <tr
                key={`${category.row}-${category.slug}`}
                className="border-t"
              >
                <td className="px-4 py-3">
                  {category.row}
                </td>

                <td className="px-4 py-3 font-medium">
                  {category.name}
                </td>

                <td className="px-4 py-3 text-gray-600">
                  {category.slug}
                </td>

                <td className="px-4 py-3">
                  {category.parent || "Main Category"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-5 flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="rounded-lg border px-5 py-2.5 text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={onConfirm}
          disabled={loading}
          className="rounded-lg bg-[#002D62] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#0055B3] disabled:opacity-50"
        >
          {loading ? "Importing..." : "Confirm Import"}
        </button>
      </div>
    </div>
  );
}