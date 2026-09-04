import { NextResponse } from "next/server";
import dbConnect from "../../../lib/dbConnect";
import Order from "../../../models/Order";

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();

    const { customer, products, subtotal, shipping, tax, total, paymentMethod } =
      body;

      //basic validataion
      if(!customer || !products || products.length ===0 || !paymentMethod){
        return NextResponse.json(
            {
                success: false,
                message: "Invalid order data",
            }
            ,{
                status: 400
            }
        );
      }

      //Generate Sukumart ProductID
      const orderId = `SUK${Math.floor(
  100000 + Math.random() * 900000
)}`;

      //create  order
      const order = await Order.create(
        {
           orderId, customer, products, subtotal, shipping, tax, total, paymentMethod,
        }
      );

      return NextResponse.json(
        {
            success: true,
            message: "Order placed successfully",
            order,
        }
      )

  } catch (error) {
    console.error("Create order api error", error);
    return NextResponse.json(
        {
            success:false,
            message: "Failed to create order",
            error: error.message,
        },{
            status: 500
        }
    )
  }
}


//GET All Orders
export async function GET() {
    try{

        await dbConnect();

        const orders = await Order.find().sort( {createdAt: -1}).populate("products.productId");

        return NextResponse.json(
            {
                success: true,
                orders,
            }
        )

    }catch(error){
        console.error("Get all order error", error);
        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch all order",
                error: error.message,
            }
        )
    }
}
