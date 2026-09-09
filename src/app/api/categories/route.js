import { NextResponse } from "next/server";
import Category from "../../../models/Category";
import dbConnect from "../../../lib/dbConnect";

export async function GET() {
  try {
    await dbConnect();
    const categories = await Category.find()
      .populate("parent_id", "name, slug")
      .sort({ createdAt: -1 });
    return NextResponse.json({ success: true, categories }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { name, slug, parent_id } = body;

    if (!name || !slug) {
      return NextResponse.json(
        {
          success: false,
          message: "Name and slug are required",
        },
        {
          status: 400,
        },
      );
    }

    const existingCategory = await Category.findOne({
      $or: [{ name }, { slug }],
    });

    if (existingCategory) {
      return NextResponse.json(
        {
          success: false,
          message: "Category already exists",
        },
        {
          status: 409,
        },
      );
    }

    //check parent category exists
    if (parent_id) {
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

    const newCategory = new Category({
      name,
      slug,
      parent_id: parent_id || null,
    });
    await newCategory.save();
    return NextResponse.json(
      {
        success: true,
        message: "Category created Successfully",
        category: newCategory,
      },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}
