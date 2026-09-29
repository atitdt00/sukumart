import { NextResponse } from "next/server";
import dbConnect from "../../../../lib/dbConnect";
import { parseCsvFile } from "../../../../lib/csv/parseCsv";
import { importCategories } from "../../../../lib/csv/categoryImporter";
import { getAdminFromCookie } from "../../../../lib/adminAuth";

export async function POST(request) {
  try {
    /*
     * Admin authentication
     */
    const admin = await getAdminFromCookie();

    if (!admin) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    /*
     * Connect MongoDB
     */
    await dbConnect();

    /*
     * Get uploaded file
     */
    const formData = await request.formData();

    const file = formData.get("file");
    const previewValue = formData.get("preview");

    if (!file) {
      return NextResponse.json(
        {
          success: false,
          message: "CSV file is required",
        },
        { status: 400 }
      );
    }

    if (
      typeof file === "string" ||
      typeof file.arrayBuffer !== "function"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid CSV file",
        },
        { status: 400 }
      );
    }

    /*
     * Validate file type
     */
    const fileName = file.name?.toLowerCase() || "";

    if (!fileName.endsWith(".csv")) {
      return NextResponse.json(
        {
          success: false,
          message: "Only CSV files are allowed",
        },
        { status: 400 }
      );
    }

    /*
     * Parse CSV
     */
    const rows = await parseCsvFile(file);

    /*
     * Preview or actual import
     */
    const result = await importCategories(rows, {
      preview: previewValue === "true",
    });

    return NextResponse.json(result, {
      status: result.success ? 200 : 400,
    });
  } catch (error) {
    console.error("Category import error:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error.message ||
          "Failed to import categories",
      },
      { status: 500 }
    );
  }
}