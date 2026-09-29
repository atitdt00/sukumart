import { NextResponse } from "next/server";
import { uploadToCloudinary } from "../../../lib/uploadToCloudinary";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    const formData = await request.formData();

    const imageFile = formData.get("image");

    if (!imageFile || typeof imageFile === "string") {
      return NextResponse.json(
        {
          success: false,
          message: "No image file received",
        },
        { status: 400 },
      );
    }

    console.log("Test upload file:", {
      name: imageFile.name,
      type: imageFile.type,
      size: imageFile.size,
    });

    const result = await uploadToCloudinary(
      imageFile,
      "sukumart/test",
    );

    return NextResponse.json({
      success: true,
      message: "Image uploaded successfully",
      image: {
        public_id: result.public_id,
        secure_url: result.secure_url,
      },
    });
  } catch (error) {
    console.error("Test Cloudinary upload error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message,
        name: error.name,
        http_code: error.http_code,
      },
      { status: 500 },
    );
  }
}