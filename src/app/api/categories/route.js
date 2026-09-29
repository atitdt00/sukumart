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

    const formData = await request.formData();

    const name = formData.get("name")?.trim();
    const slug = formData.get("slug")?.trim().toLowerCase();
    const parent_id = formData.get("parent_id") || null;
    const imageFile = formData.get("image");

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
      $or: [
        { name },
        { slug },
      ],
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

    let parentCategory = null;

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

      parentCategory = await Category.findById(parent_id);

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
      if (!imageFile.type.startsWith("image/")) {
        return NextResponse.json(
          {
            success: false,
            message: "Category image must be an image file",
          },
          { status: 400 },
        );
      }

      if (imageFile.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          {
            success: false,
            message: "Category image must be smaller than 5MB",
          },
          { status: 400 },
        );
      }

      const uploadedImage =
        await uploadToCloudinary(
          imageFile,
          "sukumart/categories",
        );

      image = uploadedImage.secure_url;
    }

    // =====================================================
    // CREATE
    // =====================================================

    const newCategory = await Category.create({
      name,
      slug,
      image,
      parent_id,
    });

    // Populate parent before response
    await newCategory.populate(
      "parent_id",
      "name slug image",
    );

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
    console.error("Create category error:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error.message || "Failed to create category",
      },
      { status: 500 },
    );
  }
}