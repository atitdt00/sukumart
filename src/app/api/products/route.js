import { NextResponse } from "next/server";
import mongoose from "mongoose";

import dbConnect from "../../../lib/dbConnect";
import Product from "../../../models/Product";
import Category from "../../../models/Category";
import { uploadToCloudinary } from "../../../lib/uploadToCloudinary";

// Cloudinary Node SDK requires the Node.js runtime.
export const runtime = "nodejs";

// =====================================================
// CATEGORY POPULATE
// =====================================================

const categoryPopulate = {
  path: "category_id",
  select: "name slug parent_id",
  populate: {
    path: "parent_id",
    select: "name slug",
  },
};

// =====================================================
// IMAGE VALIDATION
// =====================================================

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

// =====================================================
// GET PRODUCTS
// GET /api/products
// =====================================================

export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);

    const category_id = searchParams.get("category_id");
    const search = searchParams.get("search");

    const query = {};

    // =====================================================
    // CATEGORY FILTER
    // =====================================================

    if (category_id) {
      if (!mongoose.Types.ObjectId.isValid(category_id)) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid category_id",
          },
          { status: 400 },
        );
      }

      query.category_id = category_id;
    }

    // =====================================================
    // SEARCH
    // =====================================================

    if (search?.trim()) {
      const searchValue = search.trim();

      query.$or = [
        {
          name: {
            $regex: searchValue,
            $options: "i",
          },
        },
        {
          description: {
            $regex: searchValue,
            $options: "i",
          },
        },
        {
          slug: {
            $regex: searchValue,
            $options: "i",
          },
        },
      ];
    }

    // =====================================================
    // GET PRODUCTS
    // =====================================================

    const products = await Product.find(query)
      .populate(categoryPopulate)
      .sort({
        createdAt: -1,
      });

    return NextResponse.json(
      {
        success: true,
        count: products.length,
        products,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Get products error:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error.message || "Failed to get products",
      },
      { status: 500 },
    );
  }
}

// =====================================================
// CREATE PRODUCT
// POST /api/products
// =====================================================

export async function POST(request) {
  try {
    await dbConnect();

    const formData = await request.formData();

    // =====================================================
    // BASIC DATA
    // =====================================================

    const name = formData.get("name")?.trim();

    const slug = formData
      .get("slug")
      ?.trim()
      .toLowerCase();

    const description =
      formData.get("description")?.trim() || "";

    const category_id =
      formData.get("category_id");

    // =====================================================
    // NUMBERS
    // =====================================================

    const priceValue = formData.get("price");
    const discountPriceValue =
      formData.get("discountPrice");
    const stockValue = formData.get("stock");

    const price = Number(priceValue);

    const discountPrice =
      discountPriceValue !== null &&
      discountPriceValue !== ""
        ? Number(discountPriceValue)
        : 0;

    const stock =
      stockValue !== null &&
      stockValue !== ""
        ? Number(stockValue)
        : 0;

    // =====================================================
    // FILES
    // =====================================================

    const thumbnailFile =
      formData.get("thumbnail");

    const galleryFiles =
      formData.getAll("gallery");

    // =====================================================
    // REQUIRED VALIDATION
    // =====================================================

    if (!name || !slug || !category_id) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Name, slug and category are required",
        },
        { status: 400 },
      );
    }

    // =====================================================
    // PRICE VALIDATION
    // =====================================================

    if (!Number.isFinite(price) || price < 0) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Price must be a valid number greater than or equal to 0",
        },
        { status: 400 },
      );
    }

    // =====================================================
    // DISCOUNT PRICE VALIDATION
    // =====================================================

    if (
      !Number.isFinite(discountPrice) ||
      discountPrice < 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Discount price must be a valid number greater than or equal to 0",
        },
        { status: 400 },
      );
    }

    // Optional business validation
    if (discountPrice > price && discountPrice !== 0) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Discount price cannot be greater than product price",
        },
        { status: 400 },
      );
    }

    // =====================================================
    // STOCK VALIDATION
    // =====================================================

    if (!Number.isFinite(stock) || stock < 0) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Stock must be a valid number greater than or equal to 0",
        },
        { status: 400 },
      );
    }

    // =====================================================
    // CATEGORY VALIDATION
    // =====================================================

    if (
      !mongoose.Types.ObjectId.isValid(category_id)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid category_id",
        },
        { status: 400 },
      );
    }

    const category = await Category.findById(
      category_id,
    ).select("name slug parent_id");

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
     * Electronics
     *
     * OR
     *
     * Electronics → Laptops
     *
     * We intentionally allow both.
     */

    // =====================================================
    // THUMBNAIL VALIDATION
    // =====================================================

    if (
      !thumbnailFile ||
      typeof thumbnailFile === "string" ||
      thumbnailFile.size === 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Product thumbnail is required",
        },
        { status: 400 },
      );
    }

    if (
      !thumbnailFile.type.startsWith("image/")
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Product thumbnail must be an image",
        },
        { status: 400 },
      );
    }

    if (thumbnailFile.size > MAX_IMAGE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Product thumbnail must be smaller than 5MB",
        },
        { status: 400 },
      );
    }

    // =====================================================
    // GALLERY VALIDATION
    // =====================================================

    const validGalleryFiles = [];

    for (const file of galleryFiles) {
      if (
        !file ||
        typeof file === "string" ||
        file.size === 0
      ) {
        continue;
      }

      if (!file.type.startsWith("image/")) {
        return NextResponse.json(
          {
            success: false,
            message:
              `Gallery file "${file.name}" must be an image`,
          },
          { status: 400 },
        );
      }

      if (file.size > MAX_IMAGE_SIZE) {
        return NextResponse.json(
          {
            success: false,
            message:
              `Gallery image "${file.name}" must be smaller than 5MB`,
          },
          { status: 400 },
        );
      }

      validGalleryFiles.push(file);
    }

    // =====================================================
    // VARIANTS
    // =====================================================

    let variants = [];

    if (formData.has("variants")) {
      try {
        variants = JSON.parse(
          formData.get("variants") || "[]",
        );

        if (!Array.isArray(variants)) {
          return NextResponse.json(
            {
              success: false,
              message:
                "Variants must be an array",
            },
            { status: 400 },
          );
        }
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

    // =====================================================
    // BOOLEAN VALUES
    // =====================================================

    const isFeatured =
      formData.get("isFeatured") === "true";

    const isSale =
      formData.get("isSale") === "true";

    const isDeal =
      formData.get("isDeal") === "true";

    // =====================================================
    // DUPLICATE SLUG
    // =====================================================

    const existingProduct =
      await Product.findOne({ slug });

    if (existingProduct) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Product with this slug already exists",
        },
        { status: 409 },
      );
    }

    // =====================================================
    // UPLOAD THUMBNAIL TO CLOUDINARY
    // =====================================================

    const thumbnailUpload =
      await uploadToCloudinary(
        thumbnailFile,
        "sukumart/products",
      );

    if (!thumbnailUpload?.secure_url) {
      throw new Error(
        "Failed to upload product thumbnail",
      );
    }

    const thumbnail =
      thumbnailUpload.secure_url;

    // =====================================================
    // UPLOAD GALLERY TO CLOUDINARY
    // =====================================================

    const gallery = [];

    for (const file of validGalleryFiles) {
      const uploadedImage =
        await uploadToCloudinary(
          file,
          "sukumart/products/gallery",
        );

      if (!uploadedImage?.secure_url) {
        throw new Error(
          `Failed to upload gallery image: ${file.name}`,
        );
      }

      gallery.push(
        uploadedImage.secure_url,
      );
    }

    // =====================================================
    // CREATE PRODUCT
    // =====================================================

    const product = await Product.create({
      name,
      slug,
      category_id,
      price,
      discountPrice,
      stock,
      thumbnail,
      gallery,
      description,
      variants,
      isFeatured,
      isSale,
      isDeal,
    });

    // =====================================================
    // POPULATED RESPONSE
    // =====================================================

    const populatedProduct =
      await Product.findById(
        product._id,
      ).populate(categoryPopulate);

    return NextResponse.json(
      {
        success: true,
        message:
          "Product created successfully",
        product: populatedProduct,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error(
      "Create product error:",
      error,
    );

    if (error.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Product slug already exists",
        },
        { status: 409 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        message:
          error.message ||
          "Failed to create product",
      },
      { status: 500 },
    );
  }
}