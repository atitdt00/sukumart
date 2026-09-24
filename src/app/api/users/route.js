import { NextResponse } from "next/server";
import dbConnect from "../../../lib/dbConnect";
import User from "../../../models/User";
import { clerkClient } from "@clerk/nextjs/server";
import { getAdminFromCookie } from "../../../lib/adminAuth";

// =========================
// CHECK ADMIN
// =========================

async function checkAdmin() {
  const admin = await getAdminFromCookie();

  if (!admin) {
    return {
      authorized: false,
      response: NextResponse.json(
        {
          success: false,
          message: "Unauthorized. Admin login required.",
        },
        { status: 401 }
      ),
    };  
  }

  if (admin.role !== "admin") {
    return {
      authorized: false,
      response: NextResponse.json(
        {
          success: false,
          message: "Access denied. Admin only.",
        },
        { status: 403 }
      ),
    };
  }

  return {
    authorized: true,
    admin,
  };
}

// =========================
// GET ALL CLERK CUSTOMERS
// =========================

export async function GET() {
  try {
    await dbConnect();

    // =========================
    // ADMIN AUTHENTICATION
    // =========================

    const authResult = await checkAdmin();

    if (!authResult.authorized) {
      return authResult.response;
    }

    // =========================
    // GET USERS FROM CLERK
    // =========================

    const client = await clerkClient();

    const clerkUsers = await client.users.getUserList({
      orderBy: "-created_at",
    });

    // =========================
    // GET ROLES FROM MONGODB
    // =========================

    const mongoUsers = await User.find()
      .select("clerkId role fullName email createdAt")
      .lean();





    // =========================
    // CREATE ROLE MAP
    // =========================

    const roleMap = new Map(
      mongoUsers
        .filter((user) => user.clerkId)
        .map((user) => [
          user.clerkId,
          user.role,
        ])
    );

 

    //create mongodb users

    const mongoUserMap=new Map(mongoUsers.map((user)=> [
      user.clerkId || user.email,
      user,
    ]))

    //convert clerk users

    const clerkUserList= clerkUsers.data.map((user)=>{
      const email= user.primaryEmailAddress?.emailAddress?.toLowerCase().trim() || "";

      const mongoUser=mongoUserMap.get(user.id) || mongoUserMap.get(email);
      
      return {
        _id: user.id,
        clerkId: user.id,

        fullName: [user.firstName, user.lastName].filter(Boolean).join("") || "User",

        email,
        role: mongoUser?.role || "Customer",

        createdAt: user.createdAt,
        authType: "clerk",
      }

    })

    //Get admin users

    const adminUsers= mongoUsers.filter((user)=> user.role === "admin" && !user.clerkId).map((user)=> (
      {
        _id: user._id.toString(),

        clerkId: null,
        fullName: user.fullName,
        email: user.email,
        role: "admin",
        creeatedAt: user.createdAt,
        authType: "admin",
      }
    ));

    const users=[...clerkUserList, ...adminUsers,]

    return NextResponse.json(
      {
        success: true,
        count: users.length,
        users,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get users error:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error.message || "Failed to fetch users",
      },
      { status: 500 }
    );
  }
}

// =========================
// CREATE CLERK CUSTOMER
// =========================

export async function POST(request) {
  try {
    await dbConnect();

    // =========================
    // ADMIN AUTHENTICATION
    // =========================

    const authResult = await checkAdmin();

    if (!authResult.authorized) {
      return authResult.response;
    }

    // =========================
    // GET REQUEST BODY
    // =========================

    const body = await request.json();

    const {
      fullName,
      email,
      password,
    } = body;

    // =========================
    // REQUIRED FIELDS
    // =========================

    if (!fullName || !email || !password) {
      return NextResponse.json(
        {
          success: false,
          message:
            "fullName, email and password are required",
        },
        { status: 400 }
      );
    }

    const normalizedEmail =
      email.toLowerCase().trim();

    // =========================
    // CHECK MONGODB USER
    // =========================

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "User already exists",
        },
        { status: 409 }
      );
    }

    

    return NextResponse.json(
      {
        success: true,
        message: "User created successfully",
        clerkUserId: clerkUser.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create user error:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error.message ||
          "Failed to create user",
      },
      { status: 500 }
    );
  }
}