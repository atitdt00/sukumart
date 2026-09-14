import { cookies } from "next/headers";
import dbConnect from "../../../../lib/dbConnect";
import { NextResponse } from "next/server";
import { verifyToken } from "../../../../lib/auth";
import Order from "../../../../models/Order";


export async function GET(){

    try{
        await dbConnect();

        //Get token from browser cookie
        const cookieStore= await cookies();
        const token= cookieStore.get("token")?.value;

        //no token
        if(!token){
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

        //verify token
        const decoded = verifyToken(token);

        if(!decoded){
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid token",
                },
                {
                    status: 401
                }
            )
        }

        //find user's orders

        const orders = await Order.find(
            {
                "customer.email": decoded.email
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