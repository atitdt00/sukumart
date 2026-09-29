import { NextResponse } from "next/server";
import mongoose from "mongoose";

import dbConnect from "../../../../lib/dbConnect";
import Category from "../../../../models/Category";
import Product from "../../../../models/Product";
import { uploadToCloudinary } from "../../../../lib/uploadToCloudinary";

// =====================================================
// GET CATEGORY + SUBCATEGORIES + PRODUCTS
// =====================================================

export async function GET(request, { params }) {
  try {
    await dbConnect();

    const { slug } = await params;

    const category = await Category.findOne({
      slug: slug.toLowerCase(),
    }).populate(
      "parent_id",
      "name slug image",
    );

    if (!category) {
      return NextResponse.json(
        {
          success: false,
          message: "Category not found",
        },
        { status: 404 },
      );
    }

    // =====================================================
    // FIND CHILD CATEGORIES
    // =====================================================

    const subCategories = await Category.find({
      parent_id: category._id,
    }).sort({
      name: 1,
    });

    // =====================================================
    // PRODUCT IDS
    // =====================================================

    let categoryIds = [category._id];

    /*
     * If this is a main category:
     *
     * Electronics
     * ├── Laptops
     * ├── Monitors
     * └── Headphones
     *
     * Include products from:
     *
     * Electronics
     * Laptops
     * Monitors
     * Headphones
     */

    if (!category.parent_id && subCategories.length > 0) {
      categoryIds = [
        category._id,
        ...subCategories.map(
          (subCategory) => subCategory._id,
        ),
      ];
    }

    // =====================================================
    // FIND PRODUCTS
    // =====================================================

    const products = await Product.find({
      category_id: {
        $in: categoryIds,
      },
    })
      .populate({
        path: "category_id",
        select: "name slug parent_id",
        populate: {
          path: "parent_id",
          select: "name slug",
        },
      })
      .sort({
        createdAt: -1,
      });

    return NextResponse.json(
      {
        success: true,
        category,

        parentCategory:
          category.parent_id || null,

        subCategories,

        count: products.length,

        products,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(
      "Category products API error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error.message ||
          "Failed to get category",
      },
      { status: 500 },
    );
  }
}

// =====================================================
// DELETE CATEGORY
// =====================================================

export async function DELETE(
  request,
  { params },
) {
  try {
    await dbConnect();

    const { slug } = await params;

    const category = await Category.findOne({
      slug: slug.toLowerCase(),
    });

    if (!category) {
      return NextResponse.json(
        {
          success: false,
          message: "Category not found",
        },
        { status: 404 },
      );
    }

    // =====================================================
    // CHECK PRODUCTS
    // =====================================================

    const productCount =
      await Product.countDocuments({
        category_id: category._id,
      });

    if (productCount > 0) {
      return NextResponse.json(
        {
          success: false,
          message: `Cannot delete category. ${productCount} product(s) belong to this category.`,
        },
        { status: 400 },
      );
    }

    // =====================================================
    // CHECK CHILDREN
    // =====================================================

    const childCount =
      await Category.countDocuments({
        parent_id: category._id,
      });

    if (childCount > 0) {
      return NextResponse.json(
        {
          success: false,
          message: `Cannot delete category. ${childCount} subcategory(ies) belong to this category.`,
        },
        { status: 400 },
      );
    }

    await Category.findByIdAndDelete(
      category._id,
    );

    return NextResponse.json(
      {
        success: true,
        message:
          "Category deleted successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(
      "Delete category error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error.message ||
          "Failed to delete category",
      },
      { status: 500 },
    );
  }
}

// =====================================================
// UPDATE CATEGORY
// =====================================================

export async function PUT(
  request,
  { params },
) {
  try {
    await dbConnect();

    const { slug } = await params;

    const category = await Category.findOne({
      slug: slug.toLowerCase(),
    });

    if (!category) {
      return NextResponse.json(
        {
          success: false,
          message: "Category not found",
        },
        { status: 404 },
      );
    }

    const formData = await request.formData();

    const name = formData.get("name")?.trim();
    const newSlug =
      formData.get("slug")?.trim().toLowerCase();

    const parent_id =
      formData.get("parent_id") || null;

    const imageFile = formData.get("image");

    // =====================================================
    // NAME
    // =====================================================

    if (!name) {
      return NextResponse.json(
        {
          success: false,
          message: "Category name is required",
        },
        { status: 400 },
      );
    }

    // =====================================================
    // DUPLICATE NAME
    // =====================================================

    const existingName =
      await Category.findOne({
        name,
        _id: {
          $ne: category._id,
        },
      });

    if (existingName) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Category name already exists",
        },
        { status: 409 },
      );
    }

    // =====================================================
    // DUPLICATE SLUG
    // =====================================================

    if (newSlug) {
      const existingSlug =
        await Category.findOne({
          slug: newSlug,
          _id: {
            $ne: category._id,
          },
        });

      if (existingSlug) {
        return NextResponse.json(
          {
            success: false,
            message: "Slug already exists",
          },
          { status: 409 },
        );
      }
    }

    // =====================================================
    // VALIDATE PARENT
    // =====================================================

    if (parent_id) {
      if (
        !mongoose.Types.ObjectId.isValid(
          parent_id,
        )
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Invalid parent category ID",
          },
          { status: 400 },
        );
      }

      // Cannot be itself
      if (
        parent_id.toString() ===
        category._id.toString()
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Category cannot be its own parent",
          },
          { status: 400 },
        );
      }

      const parentCategory =
        await Category.findById(parent_id);

      if (!parentCategory) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Parent category not found",
          },
          { status: 404 },
        );
      }

      // Prevent third-level categories
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
    // IMAGE
    // =====================================================

    let image = category.image || "";

    if (
      imageFile &&
      typeof imageFile !== "string" &&
      imageFile.size > 0
    ) {
      if (!imageFile.type.startsWith("image/")) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Category image must be an image file",
          },
          { status: 400 },
        );
      }

      if (imageFile.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Category image must be smaller than 5MB",
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
    // UPDATE
    // =====================================================

    category.name = name;

    if (newSlug) {
      category.slug = newSlug;
    }

    category.parent_id = parent_id;

    category.image = image;

    await category.save();

    await category.populate(
      "parent_id",
      "name slug image",
    );

    return NextResponse.json(
      {
        success: true,
        message: parent_id
          ? "Subcategory updated successfully"
          : "Category updated successfully",
        category,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(
      "Update category error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error.message ||
          "Failed to update category",
      },
      { status: 500 },
    );
  }
}