import { NextResponse } from "next/server";
import dbConnect from "../../../../lib/dbConnect";
import User from "../../../../models/User";
import { auth } from "@clerk/nextjs/server";

export async function GET(request) {
  try {
    await dbConnect();

    const { userId }= await auth();
    if (!userId) {
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
   const user= await User.findOne({
    clerkId: userId,
   }).select("-password");


    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User  not found",
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
    console.error("GET /api/auth/me errors:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Server error",
      },
      {
        status: 500,
      },
    );
  }
}
