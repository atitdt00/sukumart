import { NextResponse } from "next/server";
import Product from "../../../../models/Product";
import Category from "../../../../models/Category";
import User from "../../../../models/User";
import dbConnect from "../../../../lib/dbConnect";
import Order from "../../../../models/Order";


export async function GET() {
  try {
    await dbConnect();

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
        message: error.message,
      },
      { status: 500 }
    );
  }
}