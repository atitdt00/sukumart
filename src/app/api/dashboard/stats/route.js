import { NextResponse } from "next/server";

import Product from "../../../../models/Product";
import Category from "../../../../models/Category";
import User from "../../../../models/User";
import Order from "../../../../models/Order";

import dbConnect from "../../../../lib/dbConnect";
import { getAdminFromCookie } from "../../../../lib/adminAuth";

export async function GET() {
  try {
    await dbConnect();

    // Check admin authentication
    const admin = await getAdminFromCookie();

    if (!admin) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized. Admin login required.",
        },
        { status: 401 }
      );
    }

    // Make sure logged-in user is admin
    if (admin.role !== "admin") {
      return NextResponse.json(
        {
          success: false,
          message: "Access denied. Admin only.",
        },
        { status: 403 }
      );
    }

    // Get dashboard statistics
    const [products, categories, users, orders] = await Promise.all([
      Product.countDocuments(),
      Category.countDocuments(),
      User.countDocuments(),
      Order.countDocuments(),
    ]);

    return NextResponse.json(
      {
        success: true,
        stats: {
          products,
          categories,
          users,
          orders,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Dashboard stats error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load dashboard statistics",
      },
      { status: 500 }
    );
  }
}