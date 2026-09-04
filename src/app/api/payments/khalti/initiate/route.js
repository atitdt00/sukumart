import { NextResponse } from "next/server";
import axios from "axios";
import dbConnect from "../../../../../lib/dbConnect";
import Order from "../../../../../models/Order";

export async function POST(request) {
  try {
    await dbConnect();

    const { orderId } = await request.json();

    const order = await Order.findById(orderId);

    if (!order) {
      return NextResponse.json(
        {
          success: false,
          message: "Order not found",
        },
        {
          status: 404,
        }
      );
    }

    const payload = {
      return_url:
        `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/khalti/callback`,

      website_url:
        process.env.NEXT_PUBLIC_APP_URL,

      amount: Math.round(order.total * 100),

      purchase_order_id: order._id.toString(),

      purchase_order_name: `Order-${order._id}`,

      customer_info: {
        name: order.customer.fullName,
        email: order.customer.email,
        phone: order.customer.phone,
      },
    };

    const response = await axios.post(
      "https://a.khalti.com/api/v2/epayment/initiate/",
      payload,
      {
        headers: {
          Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return NextResponse.json({
      success: true,
      paymentUrl: response.data.payment_url,
      pidx: response.data.pidx,
    });
  } catch (error) {
    console.error(
      "Khalti initiation error:",
      error.response?.data || error.message
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error.response?.data?.detail ||
          "Failed to initiate Khalti payment",
      },
      {
        status: error.response?.status || 500,
      }
    );
  }
}