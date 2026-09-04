import { NextResponse } from "next/server";
import dbConnect from "../../../../lib/dbConnect";
import jwt from "jsonwebtoken";
import User from "../../../../models/User";

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
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("Decoded JWT:", decoded);
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
