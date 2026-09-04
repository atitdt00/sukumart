import { NextResponse } from "next/server";
import dbConnect from "../../../../../lib/dbConnect";
import Order from "../../../../../models/Order";

export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);

    const data = searchParams.get("data");

    // If eSewa does not send payment data
    if (!data) {
      return NextResponse.redirect(
        new URL("/payment-failed", request.url)
      );
    }

    // Decode eSewa response
    const decodedData = JSON.parse(
      Buffer.from(data, "base64").toString("utf-8")
    );

    console.log("eSewa failure response:", decodedData);

    const transactionUuid = decodedData.transaction_uuid;

    // Find the order
    const order = await Order.findById(transactionUuid);

    if (order) {
      order.paymentStatus = "failed";

      order.gatewayResponse = decodedData;

      await order.save();
    }

    // Redirect user to frontend failure page
    return NextResponse.redirect(
      new URL(
        `/payment-failed?order=${transactionUuid}`,
        request.url
      )
    );
  } catch (error) {
    console.error("eSewa failure error:", error);

    return NextResponse.redirect(
      new URL("/payment-failed", request.url)
    );
  }
}