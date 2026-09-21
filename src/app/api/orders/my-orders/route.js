import dbConnect from "../../../../lib/dbConnect";
import { NextResponse } from "next/server";
import Order from "../../../../models/Order";
import { auth } from "@clerk/nextjs/server";
import User from "../../../../models/User";



export async function GET(){

    try{
        await dbConnect();

        //Get token from browser cookie
       const { userId } = await auth();
        console.log("CLERK USER ID:", userId);

        //no token
        if(!userId){
            return NextResponse.json(
                {
                    success: false,
                    message:"Unauthorized",
                },
                {
                    status: 401
                }
            )
        }

       //find mongodb user using clerk userid

       const user= await User.findOne({
        clerkId: userId
       })

       console.log("MongoDB user:", user);

        if(!user){
            return NextResponse.json(
                {
                    success: false,
                    message: "MongoDB user not found",
                },
                {
                    status: 404
                }
            )
        }

        //find user's orders

        const orders = await Order.find(
            {
                "customer.email": user.email
            }
        ).sort({createdAt: -1})
        .populate("products.productId");

        return NextResponse.json(
            {
                success: true,
                orders,
            }
        )

    }catch(error){
        console.error('My order api error', error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch your orders",
            },
            {
                status: 500
            }
        )
    }
}