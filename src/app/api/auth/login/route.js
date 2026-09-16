import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "../../../../lib/dbConnect";
import { createToken } from "../../../../lib/auth";
import User from "../../../../models/User";

export async function POST(request) {
  try {
    await dbConnect();

    const body = await request.json();

    const { email, password } = body;

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Email and password are required",
        },
        { status: 400 },
      );
    }

    // Find admin
    const user = await User.findOne({
      email: email.toLowerCase().trim(),
      role: "admin",
      isActive: true,
    }).select("+password");

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password",
        },
        { status: 401 },
      );
    }

    // Check account status
    if (!user.isActive) {
      return NextResponse.json(
        {
          success: false,
          message: "Your account is inactive",
        },
        { status: 403 },
      );
    }

    // Compare password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password",
        },
        { status: 401 },
      );
    }

    //create jwt token
    const token = createToken(user);
    
    // Don't send password to frontend
    const userData = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
    };

    const response= NextResponse.json(
      {
        success: true,
        message: "Login successful",
        users: userData,
      },
      { status: 200 },
    );

    //store jwt in http-only cookie
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return response;
  } catch (error) {
    console.error("Login error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
      },
      { status: 500 },
    );
  }
}
