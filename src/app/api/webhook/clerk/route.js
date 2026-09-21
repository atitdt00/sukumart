import { NextResponse } from "next/server";
import { verifyWebhook } from "@clerk/nextjs/webhooks";

import dbConnect from "../../../../lib/dbConnect";
import User from "../../../../models/User";

export async function POST(request) {
  try {
    // =========================
    // VERIFY CLERK WEBHOOK
    // =========================

    const event = await verifyWebhook(request);

    // =========================
    // CONNECT MONGODB
    // =========================

    await dbConnect();

    // =========================
    // GET EVENT TYPE
    // =========================

    const eventType = event.type;

    console.log("Clerk webhook received:", eventType);

    // =========================
    // USER CREATED
    // =========================

    if (eventType === "user.created") {
      const {
        id,
        first_name,
        last_name,
        email_addresses,
      } = event.data;

      const email =
        email_addresses?.[0]?.email_address
          ?.toLowerCase() || "";

      const name =
        [first_name, last_name]
          .filter(Boolean)
          .join(" ") || "User";

      await User.findOneAndUpdate(
        {
          clerkId: id,
        },
        {
          clerkId: id,
          name,
          email,
        },
        {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true,
        }
      );

      console.log(
        "MongoDB user created:",
        id
      );
    }

    // =========================
    // USER UPDATED
    // =========================

    else if (eventType === "user.updated") {
      const {
        id,
        first_name,
        last_name,
        email_addresses,
      } = event.data;

      const email =
        email_addresses?.[0]?.email_address
          ?.toLowerCase() || "";

      const name =
        [first_name, last_name]
          .filter(Boolean)
          .join(" ") || "User";

      await User.findOneAndUpdate(
        {
          clerkId: id,
        },
        {
          clerkId: id,
          name,
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
        id
      );
    }

    // =========================
    // USER DELETED
    // =========================

    else if (eventType === "user.deleted") {
      const { id } = event.data;

      await User.findOneAndDelete({
        clerkId: id,
      });

      console.log(
        "MongoDB user deleted:",
        id
      );
    }

    // =========================
    // OTHER EVENTS
    // =========================

    else {
      console.log(
        "Unhandled Clerk event:",
        eventType
      );
    }

    // =========================
    // SUCCESS RESPONSE
    // =========================

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
      "Clerk webhook error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Webhook verification or processing failed",
      },
      {
        status: 400,
      }
    );
  }
}