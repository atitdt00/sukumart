import { NextResponse } from "next/server";
import axios from "axios";
import dbConnect from "../../../../../lib/dbConnect";
import Order from "../../../../../models/Order";

export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);

    const pidx = searchParams.get("pidx");
    const purchaseOrderId = searchParams.get("purchase_order_id");

    console.log("Khalti callback:");
    console.log("pidx:", pidx);
    console.log("purchase_order_id:", purchaseOrderId);

    if (!pidx || !purchaseOrderId) {
      return NextResponse.redirect(
        new URL("/payment-failed", request.url)
      );
    }

    // Find our order
    const order = await Order.findById(purchaseOrderId);

    if (!order) {
      console.error("Order not found:", purchaseOrderId);

      return NextResponse.redirect(
        new URL("/payment-failed", request.url)
      );
    }

    // Verify payment with Khalti
    const response = await axios.post(
      "https://a.khalti.com/api/v2/epayment/lookup/",
      {
        pidx: pidx,
      },
      {
        headers: {
          Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const paymentData = response.data;

    console.log("Khalti verification:", paymentData);

    // Payment successful
    if (paymentData.status === "Completed") {
      order.paymentStatus = "paid";
      order.transactionId = paymentData.transaction_id || pidx;
      order.gatewayResponse = paymentData;

      await order.save();

      return NextResponse.redirect(
        new URL(
          `/order-success?order=${order._id}`,
          request.url
        )
      );
    }

    // Payment was not completed
    order.paymentStatus = "failed";
    order.gatewayResponse = paymentData;

    await order.save();

    return NextResponse.redirect(
      new URL(
        `/payment-failed?order=${order._id}`,
        request.url
      )
    );
  } catch (error) {
    console.error(
      "Khalti callback error:",
      error.response?.data || error.message
    );

    return NextResponse.redirect(
      new URL("/payment-failed", request.url)
    );
  }
}