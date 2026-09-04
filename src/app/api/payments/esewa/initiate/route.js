import { NextResponse } from "next/server";
import dbConnect from "../../../../../lib/dbConnect";
import Order from "../../../../../models/Order";
import crypto from "crypto";

export async function POST(request) {
  try {
    await dbConnect();

    const { orderId } = await request.json();

    console.log("eSewa orderId:", orderId);

    const order = await Order.findById(orderId);

    if (!order) {
      return NextResponse.json(
        {
          success: false,
          message: "Order not found",
        },
        { status: 404 },
      );
    }

    const transactionUuid = order._id.toString();
    const totalAmount = order.total;

    const productCode = process.env.ESEWA_PRODUCT_CODE;
    const secretKey = process.env.ESEWA_SECRET_KEY;

    if (!productCode || !secretKey) {
      console.error("Missing eSewa environment variables");

      return NextResponse.json(
        {
          success: false,
          message: "eSewa configuration is missing",
        },
        { status: 500 },
      );
    }

    // IMPORTANT:
    // This string must exactly match eSewa's required format.
    const signatureMessage =
      `total_amount=${totalAmount},` +
      `transaction_uuid=${transactionUuid},` +
      `product_code=${productCode}`;

    const signature = crypto
      .createHmac("sha256", secretKey)
      .update(signatureMessage)
      .digest("base64");

    console.log("Generated signature:", signature);

    const paymentData = {
      amount: totalAmount,
      tax_amount: 0,
      total_amount: totalAmount,
      transaction_uuid: transactionUuid,
      product_code: productCode,
      product_service_charge: 0,
      product_delivery_charge: 0,
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/esewa/success`,
      failure_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/esewa/failure`,
      signed_field_names: "total_amount,transaction_uuid,product_code",
      signature: signature,
    };
    console.log("Signature message:", signatureMessage);
    console.log("Generated signature:", signature);
    console.log("eSewa payment data:", paymentData);

    return NextResponse.json({
      success: true,
      paymentUrl: "https://rc-epay.esewa.com.np/api/epay/main/v2/form",
      paymentData,
    });
  } catch (error) {
    console.error("eSewa initiate error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to initiate eSewa payment",
      },
      { status: 500 },
    );
  }
}
