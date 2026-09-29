import { NextResponse } from "next/server";
import cloudinary from "../../../lib/cloudinary";

export const runtime = "nodejs";

export async function GET() {
  try {
    const result = await cloudinary.api.ping();

    return NextResponse.json({
      success: true,
      message: "Cloudinary connection successful",
      result,
    });
  } catch (error) {
    console.error("Cloudinary test error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message,
        http_code: error.http_code,
      },
      { status: 500 },
    );
  }
}