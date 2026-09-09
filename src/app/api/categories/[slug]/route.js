import { NextResponse } from "next/server";
import dbConnect from "../../../../lib/dbConnect";
import Category from "../../../../models/Category";
import Product from "../../../../models/Product";

// =========================
// GET CATEGORY + PRODUCTS
// =========================
export async function GET(request, { params }) {
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
        {
          status: 404,
        },
      );
    }

    const products = await Product.find({
      category_id: category._id,
    })
      .populate("category_id", "name slug")
      .sort({ createdAt: -1 });

    return NextResponse.json(
      {
        success: true,
        category,
        count: products.length,
        products,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("Category products API error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      {
        status: 500,
      },
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await dbConnect();

    const { slug } = await params;

    // Find category using slug
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

    // Check if products belong to this category
    const productCount = await Product.countDocuments({
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

    // Check if category has child categories
    const childCount = await Category.countDocuments({
      parent_id: category._id,
    });

    if (childCount > 0) {
      return NextResponse.json(
        {
          success: false,
          message: `Cannot delete category. ${childCount} child categor(y/ies) belong to this category.`,
        },
        { status: 400 },
      );
    }

    // Delete category
    await Category.findByIdAndDelete(category._id);

    return NextResponse.json(
      {
        success: true,
        message: "Category deleted successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Delete category by slug error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 },
    );
  }
}

export async function PUT(request, { params }) {
  try {
    await dbConnect();

    const { slug } = await params;

    const category = await Category.findOne({
      slug: slug.toLowerCase()
  });

    if (!category) {
      return NextResponse.json(
        {
          success: false,
          message: "Category not found",
        },
        { status: 404 }
      );
    }

    const body = await request.json();

    const { name, slug: newSlug,  image, parent_id } = body;

    if (!name) {
      return NextResponse.json(
        {
          success: false,
          message: "Category name is required",
        },
        { status: 400 }
      );
    }

    // Check duplicate name
    if (name !== category.name) {
      const existingName = await Category.findOne({
        name,
        _id: { $ne: category._id },
      });

      if (existingName) {
        return NextResponse.json(
          {
            success: false,
            message: "Category name already exists",
          },
          { status: 409 }
        );
      }
    }

    // Check duplicate slug
    if (newSlug && newSlug.toLowerCase() !== category.slug) {
      const existingSlug = await Category.findOne({
        slug: newSlug.toLowerCase(),
        _id: { $ne: category._id },
      });

      if (existingSlug) {
        return NextResponse.json(
          {
            success: false,
            message: "Slug already exists",
          },
          { status: 409 }
        );
      }
    }

    // Check parent
    if (parent_id) {
      if (parent_id.toString() === category._id.toString()) {
        return NextResponse.json(
          {
            success: false,
            message: "Category cannot be its own parent",
          },
          { status: 400 }
        );
      }

      const parentCategory = await Category.findById(parent_id);

      if (!parentCategory) {
        return NextResponse.json(
          {
            success: false,
            message: "Parent category not found",
          },
          { status: 404 }
        );
      }
    }

    category.name = name;

    if (newSlug) {
      category.slug = newSlug.toLowerCase();
    }

    if (image !== undefined) {
      category.image = image;
    }

    category.parent_id = parent_id || null;

    await category.save();

    return NextResponse.json(
      {
        success: true,
        message: "Category updated successfully",
        category,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update category error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}