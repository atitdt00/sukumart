import { NextResponse } from "next/server";
import dbConnect from "../../../../lib/dbConnect";
import User from "../../../../models/User";
import { verifyToken } from "../../../../lib/auth";
import { auth } from "@clerk/nextjs/server";

export async function GET(request) {
  try {
    await dbConnect();

    
     // ==========================================
    // 1. CHECK CLERK CUSTOMER
    // ==========================================

    const { userId } = await auth();

    if (userId) {
      const user = await User.findOne({
        clerkId: userId,
      }).select("-password");

      if (!user) {
        return NextResponse.json(
          {
            success: false,
            message: "Customer not found",
          },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        user,
        authType: "clerk",
      });
    }

   // ==========================================
    // 1. CHECK Admin
    // ==========================================

    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Not authenticated",
        },
        {
          status: 401,
        },
      );
    }
    const decoded =verifyToken(token);

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User is not found",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json(
      {
        success: true,
        user: user,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("userMe  errors:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Invalid or expired token",
      },
      {
        status: 401,
      },
    );
  }
}
