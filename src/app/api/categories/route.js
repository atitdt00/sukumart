import { NextResponse } from "next/server";
import mongoose from "mongoose";

import Category from "../../../models/Category";
import dbConnect from "../../../lib/dbConnect";
import { uploadToCloudinary } from "../../../lib/uploadToCloudinary";

export const runtime = "nodejs";

// =====================================================
// GET ALL CATEGORIES
// =====================================================

export async function GET() {
  try {
    await dbConnect();

    const categories = await Category.find()
      .populate("parent_id", "name slug image")
      .sort({ name: 1 });

    const parentCategories = categories.filter(
      (category) => !category.parent_id,
    );

    const subCategories = categories.filter(
      (category) => category.parent_id,
    );

    return NextResponse.json(
      {
        success: true,
        categories,
        parentCategories,
        subCategories,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Get categories error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to get categories",
      },
      { status: 500 },
    );
  }
}

// =====================================================
// CREATE CATEGORY / SUBCATEGORY
// =====================================================

export async function POST(request) {
  try {
    await dbConnect();

    // =====================================================
    // READ FORM DATA
    // =====================================================

    const formData = await request.formData();

    const name = formData.get("name")?.trim();
    const slug = formData.get("slug")?.trim().toLowerCase();
    const parent_id = formData.get("parent_id") || null;
    const imageFile = formData.get("image");

    // =====================================================
    // DEBUG: CHECK RECEIVED IMAGE
    // =====================================================

    console.log("=================================");
    console.log("CATEGORY IMAGE RECEIVED");
    console.log("=================================");

    console.log({
      exists: !!imageFile,
      isString: typeof imageFile === "string",
      name: imageFile?.name,
      type: imageFile?.type,
      size: imageFile?.size,
    });

    // =====================================================
    // VALIDATION
    // =====================================================

    if (!name || !slug) {
      return NextResponse.json(
        {
          success: false,
          message: "Name and slug are required",
        },
        { status: 400 },
      );
    }

    // =====================================================
    // CHECK DUPLICATE
    // =====================================================

    const existingCategory = await Category.findOne({
      $or: [{ name }, { slug }],
    });

    if (existingCategory) {
      return NextResponse.json(
        {
          success: false,
          message: "Category already exists",
        },
        { status: 409 },
      );
    }

    // =====================================================
    // VALIDATE PARENT
    // =====================================================

    if (parent_id) {
      if (!mongoose.Types.ObjectId.isValid(parent_id)) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid parent category ID",
          },
          { status: 400 },
        );
      }

      const parentCategory = await Category.findById(parent_id);

      if (!parentCategory) {
        return NextResponse.json(
          {
            success: false,
            message: "Parent category not found",
          },
          { status: 404 },
        );
      }

      // Only main categories can be parents.
      if (parentCategory.parent_id) {
        return NextResponse.json(
          {
            success: false,
            message:
              "A subcategory cannot be used as a parent category",
          },
          { status: 400 },
        );
      }
    }

    // =====================================================
    // UPLOAD CATEGORY IMAGE
    // =====================================================

    let image = "";

    if (
      imageFile &&
      typeof imageFile !== "string" &&
      imageFile.size > 0
    ) {
      console.log("=================================");
      console.log("UPLOADING CATEGORY IMAGE");
      console.log("=================================");

      console.log({
        name: imageFile.name,
        type: imageFile.type,
        size: imageFile.size,
      });

      // ---------------------------------------------------
      // Validate file type
      // ---------------------------------------------------

      if (!imageFile.type.startsWith("image/")) {
        return NextResponse.json(
          {
            success: false,
            message: "Category image must be an image file",
          },
          { status: 400 },
        );
      }

      // ---------------------------------------------------
      // Validate file size
      // ---------------------------------------------------

      if (imageFile.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          {
            success: false,
            message: "Category image must be smaller than 5MB",
          },
          { status: 400 },
        );
      }

      // ---------------------------------------------------
      // Upload to Cloudinary
      // ---------------------------------------------------

      const uploadedImage = await uploadToCloudinary(
        imageFile,
        "sukumart/categories",
      );

      // ---------------------------------------------------
      // DEBUG: Cloudinary response
      // ---------------------------------------------------

      console.log("=================================");
      console.log("CLOUDINARY RESULT");
      console.log("=================================");

      console.log({
        public_id: uploadedImage?.public_id,
        secure_url: uploadedImage?.secure_url,
        resource_type: uploadedImage?.resource_type,
      });

      // ---------------------------------------------------
      // Make sure Cloudinary returned URL
      // ---------------------------------------------------

      if (!uploadedImage?.secure_url) {
        throw new Error(
          "Cloudinary upload completed but no secure URL was returned",
        );
      }

      image = uploadedImage.secure_url;

      console.log("CATEGORY IMAGE URL:", image);
    } else {
      console.log("No category image received.");
    }

    // =====================================================
    // CREATE CATEGORY
    // =====================================================

    const newCategory = await Category.create({
      name,
      slug,
      image,
      parent_id,
    });

    // =====================================================
    // POPULATE PARENT
    // =====================================================

    await newCategory.populate(
      "parent_id",
      "name slug image",
    );

    // =====================================================
    // RESPONSE
    // =====================================================

    return NextResponse.json(
      {
        success: true,
        message: parent_id
          ? "Subcategory created successfully"
          : "Category created successfully",
        category: newCategory,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("=================================");
    console.error("CREATE CATEGORY ERROR");
    console.error("=================================");

    console.error("Message:", error.message);
    console.error("Name:", error.name);
    console.error("HTTP Code:", error.http_code);
    console.error("Full error:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error.message || "Failed to create category",
        name: error.name,
        http_code: error.http_code || null,
      },
      { status: 500 },
    );
  }
}