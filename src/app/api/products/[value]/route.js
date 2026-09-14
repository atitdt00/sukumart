import { NextResponse } from "next/server";
import mongoose from "mongoose";

import dbConnect from "../../../../lib/dbConnect";
import Product from "../../../../models/Product";
import Category from "../../../../models/Category";

// ============================================
// GET PRODUCT BY SLUG
// GET /api/products/:value
// ============================================

export async function GET(request, { params }) {
  try {
    await dbConnect();

    const { value } = await params;

    const product = await Product.findOne({
      slug: value.toLowerCase(),
    }).populate({
      path: "category_id",
      select: "name slug parent_id",
      populate: {
        path: "parent_id",
        select: "name slug",
      },
    });

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
        message: error.message,
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

    // Here value is the MongoDB ID
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

    const category_id = formData.get("category_id");

    // Check category
    if (category_id) {
      if (!mongoose.Types.ObjectId.isValid(category_id)) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid Category ID",
          },
          { status: 400 },
        );
      }

      const category = await Category.findById(category_id);

      if (!category) {
        return NextResponse.json(
          {
            success: false,
            message: "Category not found",
          },
          { status: 404 },
        );
      }
    }

    // Build update data dynamically
    const updateData = {};

    if (formData.has("name")) {
      updateData.name = formData.get("name");
    }

    if (formData.has("slug")) {
      updateData.slug = formData.get("slug");
    }

    if (formData.has("price")) {
      updateData.price = Number(formData.get("price"));
    }

    if (formData.has("stock")) {
      updateData.stock = Number(formData.get("stock"));
    }

    if (formData.has("category_id")) {
      updateData.category_id = category_id;
    }

    if (formData.has("description")) {
      updateData.description = formData.get("description");
    }

    if (formData.has("variants")) {
      updateData.variants = JSON.parse(formData.get("variants") || "[]");
    }

    if (formData.has("isFeatured")) {
      updateData.isFeatured = formData.get("isFeatured") === "true";
    }

    if(formData.has("isSale")){
      updateData.isSale= formData.get("isSale")=== "true";
    }
      if(formData.has("isDeal")){
      updateData.isDeal= formData.get("isDeal")=== "true";
    }

    const product = await Product.findByIdAndUpdate(value, updateData, {
      new: true,
      runValidators: true,
    }).populate({
      path: "category_id",
      select: "name slug parent_id",
      populate: {
        path: "parent_id",
        select: "name slug",
      },
    });

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

    return NextResponse.json(
      {
        success: false,
        message: error.message,
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

    // Here value is the MongoDB ID
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
        message: error.message,
      },
      { status: 500 },
    );
  }
}
