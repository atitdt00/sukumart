import { NextResponse } from "next/server";
import mongoose from "mongoose";

import dbConnect from "../../../../lib/dbConnect";
import Product from "../../../../models/Product";
import Category from "../../../../models/Category";
import { uploadToCloudinary } from "../../../../lib/uploadToCloudinary";

// ============================================
// CATEGORY POPULATE
// ============================================

const categoryPopulate = {
  path: "category_id",
  select: "name slug parent_id",
  populate: {
    path: "parent_id",
    select: "name slug",
  },
};

// ============================================
// GET PRODUCT BY SLUG
// GET /api/products/:value
// ============================================

export async function GET(request, { params }) {
  try {
    await dbConnect();

    const { value } = await params;

    if (!value) {
      return NextResponse.json(
        {
          success: false,
          message: "Product slug is required",
        },
        { status: 400 },
      );
    }

    const product = await Product.findOne({
      slug: value.trim().toLowerCase(),
    }).populate(categoryPopulate);

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          message: "Product not found",
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        product,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("GET product error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to get product",
      },
      { status: 500 },
    );
  }
}

// ============================================
// UPDATE PRODUCT BY ID
// PUT /api/products/:value
// ============================================

export async function PUT(request, { params }) {
  try {
    await dbConnect();

    const { value } = await params;

    // value is MongoDB Product ID
    if (!mongoose.Types.ObjectId.isValid(value)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid Product ID",
        },
        { status: 400 },
      );
    }

    const formData = await request.formData();
    const thumbnailFile = formData.get("thumbnail");
    const galleryFiles = formData.getAll("gallery");

    const updateData = {};

    // ============================================
    // NAME
    // ============================================

    if (formData.has("name")) {
      const name = formData.get("name")?.trim();

      if (!name) {
        return NextResponse.json(
          {
            success: false,
            message: "Product name is required",
          },
          { status: 400 },
        );
      }

      updateData.name = name;
    }

    // ============================================
    // SLUG
    // ============================================

    if (formData.has("slug")) {
      const slug = formData.get("slug")?.trim().toLowerCase();

      if (!slug) {
        return NextResponse.json(
          {
            success: false,
            message: "Product slug is required",
          },
          { status: 400 },
        );
      }

      // Check duplicate slug
      const existingProduct = await Product.findOne({
        slug,
        _id: { $ne: value },
      });

      if (existingProduct) {
        return NextResponse.json(
          {
            success: false,
            message: "Another product with this slug already exists",
          },
          { status: 409 },
        );
      }

      updateData.slug = slug;
    }

    // ============================================
    // PRICE
    // ============================================

    if (formData.has("price")) {
      const price = Number(formData.get("price"));

      if (!Number.isFinite(price) || price < 0) {
        return NextResponse.json(
          {
            success: false,
            message: "Price must be a valid number greater than or equal to 0",
          },
          { status: 400 },
        );
      }

      updateData.price = price;
    }

    // ============================================
    // DISCOUNT PRICE
    // ============================================

    if (formData.has("discountPrice")) {
      const discountPrice = Number(formData.get("discountPrice"));

      if (!Number.isFinite(discountPrice) || discountPrice < 0) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Discount price must be a valid number greater than or equal to 0",
          },
          { status: 400 },
        );
      }

      updateData.discountPrice = discountPrice;
    }

    // ============================================
    // STOCK
    // ============================================

    if (formData.has("stock")) {
      const stock = Number(formData.get("stock"));

      if (!Number.isFinite(stock) || stock < 0) {
        return NextResponse.json(
          {
            success: false,
            message: "Stock must be a valid number greater than or equal to 0",
          },
          { status: 400 },
        );
      }

      updateData.stock = stock;
    }

    // ============================================
    // CATEGORY / SUBCATEGORY
    // ============================================

    if (formData.has("category_id")) {
      const category_id = formData.get("category_id");

      if (!category_id) {
        return NextResponse.json(
          {
            success: false,
            message: "Category is required",
          },
          { status: 400 },
        );
      }

      if (!mongoose.Types.ObjectId.isValid(category_id)) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid Category ID",
          },
          { status: 400 },
        );
      }

      const category = await Category.findById(category_id).select(
        "name slug parent_id",
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

      /*
       * Product can belong to:
       *
       * Main Category
       *       OR
       * Subcategory
       *
       * Example:
       *
       * Electronics
       * ├── Laptops
       * ├── Monitors
       * └── Headphones
       *
       * Product can have:
       *
       * category_id = Electronics
       *
       * OR
       *
       * category_id = Laptops
       */

      updateData.category_id = category_id;
    }

    // ============================================
    // DESCRIPTION
    // ============================================

    if (formData.has("description")) {
      updateData.description = formData.get("description")?.trim() || "";
    }

    // ============================================
    // VARIANTS
    // ============================================

    if (formData.has("variants")) {
      try {
        const variantsValue = formData.get("variants");

        updateData.variants = JSON.parse(variantsValue || "[]");
      } catch (error) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid variants JSON",
          },
          { status: 400 },
        );
      }
    }

    // ============================================
    // FEATURED
    // ============================================

    if (formData.has("isFeatured")) {
      updateData.isFeatured = formData.get("isFeatured") === "true";
    }

    // ============================================
    // SALE
    // ============================================

    if (formData.has("isSale")) {
      updateData.isSale = formData.get("isSale") === "true";
    }

    // ============================================
    // DEAL
    // ============================================

    if (formData.has("isDeal")) {
      updateData.isDeal = formData.get("isDeal") === "true";
    }

    // ============================================
    // THUMBNAIL
    // ============================================

    if (
      thumbnailFile &&
      typeof thumbnailFile !== "string" &&
      thumbnailFile.size > 0
    ) {
      if (!thumbnailFile.type.startsWith("image/")) {
        return NextResponse.json(
          {
            success: false,
            message: "Thumbnail must be an image",
          },
          { status: 400 },
        );
      }

      if (thumbnailFile.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          {
            success: false,
            message: "Thumbnail must be smaller than 5MB",
          },
          { status: 400 },
        );
      }

      const uploadedThumbnail = await uploadToCloudinary(
        thumbnailFile,
        "sukumart/products",
      );

      updateData.thumbnail = uploadedThumbnail.secure_url;
    }

    // ============================================
    // GALLERY
    // ============================================

    if (galleryFiles.length > 0) {
      const gallery = [];

      for (const file of galleryFiles) {
        if (!file || typeof file === "string" || file.size === 0) {
          continue;
        }

        if (!file.type.startsWith("image/")) {
          continue;
        }

        if (file.size > 5 * 1024 * 1024) {
          continue;
        }

        const uploadedImage = await uploadToCloudinary(
          file,
          "sukumart/products/gallery",
        );

        gallery.push(uploadedImage.secure_url);
      }

      updateData.gallery = gallery;
    }

    // ============================================
    // UPDATE PRODUCT
    // ============================================

    const product = await Product.findByIdAndUpdate(value, updateData, {
      new: true,
      runValidators: true,
    }).populate(categoryPopulate);

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          message: "Product not found",
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Product updated successfully",
        product,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("PUT product error:", error);

    // Duplicate key error
    if (error.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          message: "Product slug already exists",
        },
        { status: 409 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to update product",
      },
      { status: 500 },
    );
  }
}

// ============================================
// DELETE PRODUCT BY ID
// DELETE /api/products/:value
// ============================================

export async function DELETE(request, { params }) {
  try {
    await dbConnect();

    const { value } = await params;

    // value is MongoDB Product ID
    if (!mongoose.Types.ObjectId.isValid(value)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid Product ID",
        },
        { status: 400 },
      );
    }

    const product = await Product.findByIdAndDelete(value);

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          message: "Product not found",
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Product deleted successfully",
        product,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("DELETE product error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to delete product",
      },
      { status: 500 },
    );
  }
}
