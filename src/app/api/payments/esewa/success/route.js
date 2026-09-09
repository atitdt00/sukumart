import { NextResponse } from "next/server";
import dbConnect from "../../../../../lib/dbConnect";
import Order from "../../../../../models/Order";

export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);

    const data = searchParams.get("data");

    if (!data) {
      return NextResponse.redirect(
        new URL("/payment-failed", request.url),
      );
    }


    const decodedData = JSON.parse(
      Buffer.from(data, "base64").toString("utf-8"),
    );

    if (decodedData.status !== "COMPLETE") {
      return NextResponse.redirect(
        new URL("/payment-failed", request.url),
      );
    }


     // Update payment status

    const order = await Order.findByIdAndUpdate(
      decodedData.transaction_uuid,
      {
        paymentStatus: "paid",
        transactionId: decodedData.transaction_code,
        gatewayResponse: decodedData,
      },
      {
        new: true,
      },
    );


    // Redirect to frontend success page
    return NextResponse.redirect(
      new URL(`/payment-success?order=${order.orderId}`, request.url),
    );
  } catch (error) {
    console.error(error);

    return NextResponse.redirect(
      new URL("/payment-failed", request.url),
    );
  }
}