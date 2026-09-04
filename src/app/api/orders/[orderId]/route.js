import { NextResponse } from "next/server";
import dbConnect from "../../../../lib/dbConnect"
import Order from "../../../../models/Order";

const allowedStatuses=[ 
    "pending",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
];


export async function GET(request,{params}){

    try{
        await dbConnect();

        const { orderId }= await params;

        const order= await Order.findOne({orderId}).populate( "products.productId")

        if(!order){
            return NextResponse.json(
                {
                    success: false,
                    message: "Order not found",
                },
                {
                    status: 404
                }
            )
        }

        return NextResponse.json(
            {
                success: true,
                order,
            },
            {
                status: 200
            },
        )

    }catch(error){
        console.log("Track order API error:",error)
        return NextResponse.json(
            {
                success: false,
                message: "Failed to track order",
            },
            {
                status: 500
            }
        )
    }
}




export async function PUT(request,{params}){
    try{
        await dbConnect();

        const {orderId}=await params;

        const body= await request.json();

        const {status}= body;

        if(!allowedStatuses.includes(status)){
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid order status",
                },
                {
                    status: 400
                }

            )
        }

        const order= await Order.findByIdAndUpdate(
            orderId,
            {
                status,
            },
            {
              new: true,
              runValidators: true,  
            }
        );

        if(!order){
            return NextResponse.json(
                {
                    success:false,
                    message: "Order not found",
                },
                {
                    status: 404
                }
            )
        }

        return NextResponse.json(
            {
                success: true,
                message: "Order status updated successfully",
                order,
            }
        )


    }catch(error){
        console.log("update order status error:",error);
        return NextResponse.json(
            {
                success: false,
                message: "Failed to update order status",
            },
            {
                status: 500
            }
        )
    }
}
