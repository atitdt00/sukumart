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
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        product,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET product error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
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
        { status: 400 }
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
          { status: 400 }
        );
      }

      const category = await Category.findById(category_id);

      if (!category) {
        return NextResponse.json(
          {
            success: false,
            message: "Category not found",
          },
          { status: 404 }
        );
      }
    }

    const updateData = {
      name: formData.get("name"),
      slug: formData.get("slug"),
      price: formData.get("price"),
      stock: formData.get("stock"),
      category_id,
    };

    const product = await Product.findByIdAndUpdate(
      value,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    ).populate({
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
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Product updated successfully",
        product,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("PUT product error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
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
        { status: 400 }
      );
    }

    const product = await Product.findByIdAndDelete(value);

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          message: "Product not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Product deleted successfully",
        product,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE product error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}