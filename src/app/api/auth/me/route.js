import { NextResponse } from "next/server";
import dbConnect from "../../../../lib/dbConnect";
import User from "../../../../models/User";
import { verifyToken } from "../../../../lib/auth";

export async function GET(request) {
  try {
    await dbConnect();

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
