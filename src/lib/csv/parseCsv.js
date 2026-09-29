import Papa from "papaparse";

export async function parseCsvFile(file) {
  if (!file) {
    throw new Error("CSV file is required");
  }

  const text = await file.text();

  if (!text.trim()) {
    throw new Error("CSV file is empty");
  }

  const result = Papa.parse(text, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header) => header.trim(),
  });

  if (result.errors?.length > 0) {
    console.error("CSV parsing errors:", result.errors);

    throw new Error(
      result.errors[0]?.message || "Failed to parse CSV file"
    );
  }

  return result.data;
}