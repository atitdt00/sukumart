
import { NextResponse } from "next/server";
import mongoose from "mongoose";

import dbConnect from "../../../../lib/dbConnect";
import Product from "../../../../models/Product";
import Category from "../../../../models/Category";

// ============================================
// GET SINGLE PRODUCT
// GET /api/products/:id
// ============================================

export async function GET(request, { params }) {
  try {
    await dbConnect();

    const { id } = await params;

    // Validate Product ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid Product ID",
        },
        {
          status: 400,
        }
      );
    }

    // Find product
    const product = await Product.findById(id).populate({
      path: "category_id",
      select: "name slug parent_id",

      populate: {
        path: "parent_id",
        select: "name slug",
      },
    });

    // Product not found
    if (!product) {
      return NextResponse.json(
        {
          success: false,
          message: "Product not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        product,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("GET product error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      {
        status: 500,
      }
    );
  }
}

// ============================================
// UPDATE PRODUCT
// PUT /api/products/:id
// ============================================

export async function PUT(request, { params }) {
  try {
    await dbConnect();

    const { id } = await params;

    // Validate Product ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid Product ID",
        },
        {
          status: 400,
        }
      );
    }

    // Get request body
    const body = await request.json();

    // Check category if category_id is being changed
    if (body.category_id) {
      if (!mongoose.Types.ObjectId.isValid(body.category_id)) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid Category ID",
          },
          {
            status: 400,
          }
        );
      }

      const category = await Category.findById(body.category_id);

      if (!category) {
        return NextResponse.json(
          {
            success: false,
            message: "Category not found",
          },
          {
            status: 404,
          }
        );
      }
    }

    // Update product
    const product = await Product.findByIdAndUpdate(
      id,
      body,
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

    // Product not found
    if (!product) {
      return NextResponse.json(
        {
          success: false,
          message: "Product not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Product updated successfully",
        product,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("PUT product error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      {
        status: 500,
      }
    );
  }
}

// ============================================
// DELETE PRODUCT
// DELETE /api/products/:id
// ============================================

export async function DELETE(request, { params }) {
  try {
    await dbConnect();

    const { id } = await params;

    // Validate Product ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid Product ID",
        },
        {
          status: 400,
        }
      );
    }

    // Delete product
    const product = await Product.findByIdAndDelete(id);

    // Product not found
    if (!product) {
      return NextResponse.json(
        {
          success: false,
          message: "Product not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Product deleted successfully",
        product,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("DELETE product error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      {
        status: 500,
      }
    );
  }
}
