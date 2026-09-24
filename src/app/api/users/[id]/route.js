import { NextResponse } from "next/server";
import dbConnect from "../../../../lib/dbConnect";
import User from "../../../../models/User";
import { clerkClient } from "@clerk/nextjs/server";


// GET single user
export async function GET(request, { params }) {
  try {
    await dbConnect();

    const { id } = await params;

    const user = await User.findById(id).select("-password");

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        user,
      },
      { status: 200 }
    );

  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}


// UPDATE user
export async function PUT(request, { params }) {
  try {
    await dbConnect();

    const { id } = await params;
    const body = await request.json();

    const {
      fullName,
      email,
      phone,
      address,
      city,
      role,
      isActive,
      avatar,
    } = body;

    const user = await User.findByIdAndUpdate(
      id,
      {
        fullName,
        email,
        phone,
        address,
        city,
        role,
        isActive,
        avatar,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "User updated successfully",
        user,
      },
      { status: 200 }
    );

  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}


// DELETE user
export async function DELETE(request, { params }) {
  try {
    await dbConnect();

    const { id } = await params;

    //Get authType from URL
    const {searchParams}= new URL(request.url);
    const authType= searchParams.get("authType");

    //Delete clerk user

    if(authType ==="clerk"){
      const client= await clerkClient();

      //Delete user from Clerk
      await client.users.deleteUser(id);

      //Delete Corresponding MongoDB user
      await User.findOneAndDelete({clerkId: id})
   
        return NextResponse.json(
          {
            success: true,
            message: "Clerk user deleted successfully",
          },
          { status: 200 }
        );
      
    }

//Delete Admin user

    if(authType ==="admin"){
      const user= await User.findByIdAndDelete(id);
      if(!user){
        return NextResponse.json(
          {
            success: false,
            message: "Admin user not found"
          },
          {
            status: 404
          }
        )
      }
      
   
        return NextResponse.json(
          {
            success: true,
            message: "Admin user deleted successfully",
          },
          { status: 200 }
        );
      
    }
//Invalid authType
    return NextResponse.json(
      {
        success: false,
        message: "authType is required",
      },
      { status: 200 }
    );

  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}