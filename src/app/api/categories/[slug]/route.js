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

// =========================
// PUT - UPDATE CATEGORY
// =========================
export async function PUT(request, { params }) {
  try {
    await dbConnect();

    const { id } = await params;

    // Find existing category
    const category = await Category.findOne(id);

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

    const body = await request.json();

    const { name, Slug, image, parent_id } = body;

    // Validate name
    if (!name) {
      return NextResponse.json(
        {
          success: false,
          message: "Category name is required",
        },
        {
          status: 400,
        },
      );
    }

    // If newSlug is provided, check duplicate slug
    if (Slug && Slug !== category.slug) {
      const existingCategory = await Category.findOne({
        slug: Slug.toLowerCase(),
        _id: { $ne: category._id },
      });

      if (existingCategory) {
        return NextResponse.json(
          {
            success: false,
            message: "Slug already exists",
          },
          {
            status: 409,
          },
        );
      }
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
          {
            status: 409,
          },
        );
      }
    }

    // Check parent category
    if (parent_id) {
      // Prevent category becoming its own parent
      if (parent_id.toString() === category._id.toString()) {
        return NextResponse.json(
          {
            success: false,
            message: "Category cannot be its own parent",
          },
          {
            status: 400,
          },
        );
      }

      const parentCategory = await Category.findById(parent_id);

      if (!parentCategory) {
        return NextResponse.json(
          {
            success: false,
            message: "Parent category not found",
          },
          {
            status: 404,
          },
        );
      }
    }

    // Update category
    category.name = name;
    category.slug = slug ? slug.toLowerCase() : category.slug;

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
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("Update category error:", error);

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

// =========================
// DELETE CATEGORY
// =========================
export async function DELETE(request, { params }) {
  try {
    await dbConnect();

    const { id } = await params;

    // Find category
    const category = await Category.findOne(id);

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

    // Check whether category has products
    const productCount = await Product.countDocuments({
      category_id: category._id,
    });

    if (productCount > 0) {
      return NextResponse.json(
        {
          success: false,
          message: `Cannot delete category. ${productCount} product(s) belong to this category.`,
        },
        {
          status: 400,
        },
      );
    }

    // Check whether category has child categories
    const childCount = await Category.countDocuments({
      parent_id: category._id,
    });

    if (childCount > 0) {
      return NextResponse.json(
        {
          success: false,
          message: `Cannot delete category. ${childCount} child categor(y/ies) belong to this category.`,
        },
        {
          status: 400,
        },
      );
    }

    // Delete category
    await Category.findByIdAndDelete(category._id);

    return NextResponse.json(
      {
        success: true,
        message: "Category deleted successfully",
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("Delete category error:", error);

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
