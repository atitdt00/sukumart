import { NextResponse } from "next/server";
import dbConnect from "../../../../lib/dbConnect";
import { clerkClient } from "@clerk/nextjs/server";



export async function POST(request){
  try{

   await dbConnect()

   const {email}= await request.json();

   if(!email){
    return NextResponse.json(
      {
        success: false,
        message: "Email is required",
      },
      {
        status: 400
      }
    )
   }

   const normalizedEmail= email.toLowerCase().trim();

   const client = await clerkClient();

   //find clerk users by email
   const users= await client.users.getUserList({
    emailAddress: [normalizedEmail],
   });

   const user= users.data?.[0];

   if(!user){
    return NextResponse.json(
      {
        success:true,
        message: "If an account with email exists, a password reset option is available.",
      },
      {
        status: 200
      }
    );
   }

   return NextResponse.json({
    success: true,
    message: "Customer account found. Continue with the clerk password reset flow."
   },{
    status:200
   }
  )


  }catch(error){
    console.error("Customer forgot password api route error:",error);

    return NextResponse.json({
      success: false,
      message: "Failed to send email to server",
    },
    {
      status: 500
    }
  )
  }
}