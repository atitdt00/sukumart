import { NextResponse } from "next/server";
import dbConnect from "../../../../lib/dbConnect";
import User from "../../../../models/User";
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();

    const { name, email, password } = body;

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Name, email and password are required",
        },
        { status: 400 },
      );
    }

    //check password length
    if(password.length < 6){
        return NextResponse.json(
            {
                success: false,
                message:" passwordd must be at least 6 characters",
            },
            {
                status: 400
            }
        )
    }
      const normalizedEmail = email.toLowerCase().trim();
       // Check existing user
    const existingUser = await User.findOne({
      email: normalizedEmail,
    });
    if(existingUser){
        return NextResponse.json(
            {
                success: false,
                message: "Email already registered",
            },
            {
                status: 409
            }
        )
    }
    
    //hash password

    const hashedPassword= await bcrypt.hash(password, 10);
    
    //Create user
    const user= await User.create(
        {
            name: name.trim(),
            email: normalizedEmail,
            password: hashedPassword,
            role: "customer",
            isActive: true,
        }
    );

    return NextResponse.json(
        {
            success: true,
            message: "Registration successfull",
            user: {
                id:user._id.toString(),
                name: user.name,
                email: user.email,
                role: user.role,
                isActive: user.isActive,
            }
        },
        {
            status: 201
        }
    )
  } catch (error) {
     console.error("Register error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
      },
      { status: 500 }
    );
  }
  
}
