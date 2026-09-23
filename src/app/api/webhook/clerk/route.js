import { NextResponse } from "next/server";
import { verifyWebhook } from "@clerk/nextjs/webhooks";

import dbConnect from "../../../../lib/dbConnect";
import User from "../../../../models/User";

export async function POST(request) {
  try {
    // =========================================
    // VERIFY CLERK WEBHOOK
    // =========================================

    const event = await verifyWebhook(request);

    // =========================================
    // CONNECT MONGODB
    // =========================================

    await dbConnect();

    // =========================================
    // EVENT TYPE
    // =========================================

    const eventType = event.type;

    console.log(
      "========================================"
    );

    console.log(
      "Clerk webhook received:",
      eventType
    );

    // =========================================
    // USER CREATED
    // =========================================

    if (eventType === "user.created") {
      const {
        id,
        first_name,
        last_name,
        email_addresses,
      } = event.data;

      console.log("Clerk User ID:", id);

      const email =
        email_addresses?.[0]?.email_address
          ?.toLowerCase()
          .trim() || "";

      const fullName =
        [first_name, last_name]
          .filter(Boolean)
          .join(" ") || "User";

      console.log("Full name:", fullName);
      console.log("Email:", email);

      // Create or update MongoDB user
      const user = await User.findOneAndUpdate(
        {
          clerkId: id,
        },
        {
          clerkId: id,
          fullName,
          email,
          role: "customer",
          isActive: true,
        },
        {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true,
        }
      );

      console.log(
        "MongoDB user created/updated:",
        user._id
      );

      console.log(
        "MongoDB Clerk ID:",
        user.clerkId
      );
    }

    // =========================================
    // USER UPDATED
    // =========================================

    else if (eventType === "user.updated") {
      const {
        id,
        first_name,
        last_name,
        email_addresses,
      } = event.data;

      console.log("Clerk User ID:", id);

      const email =
        email_addresses?.[0]?.email_address
          ?.toLowerCase()
          .trim() || "";

      const fullName =
        [first_name, last_name]
          .filter(Boolean)
          .join(" ") || "User";

      const user = await User.findOneAndUpdate(
        {
          clerkId: id,
        },
        {
          clerkId: id,
          fullName,
          email,
        },
        {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true,
        }
      );

      console.log(
        "MongoDB user updated:",
        user._id
      );

      console.log(
        "MongoDB Clerk ID:",
        user.clerkId
      );
    }

    // =========================================
    // USER DELETED
    // =========================================

    else if (eventType === "user.deleted") {
      const { id } = event.data;

      console.log(
        "Deleting Clerk user:",
        id
      );

      const deletedUser =
        await User.findOneAndDelete({
          clerkId: id,
        });

      console.log(
        "MongoDB deleted user:",
        deletedUser?._id || "User not found"
      );
    }

    // =========================================
    // OTHER EVENTS
    // =========================================

    else {
      console.log(
        "Unhandled Clerk event:",
        eventType
      );
    }

    console.log(
      "========================================"
    );

    // =========================================
    // SUCCESS
    // =========================================

    return NextResponse.json(
      {
        success: true,
        message: "Webhook processed successfully",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "========================================"
    );

    console.error(
      "Clerk webhook error:",
      error
    );

    console.error(
      "========================================"
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error.message ||
          "Webhook verification or processing failed",
      },
      {
        status: 400,
      }
    );
  }
}