import { NextResponse } from "next/server";
import dbConnect from "../../../../lib/dbConnect";
import User from "../../../../models/User";
import crypto from "crypto";
import { sendEmail } from "../../../../lib/SendEmail";

export async function POST(request) {
  try {
    await dbConnect();

    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          message: "Email is Required",
        },
        {
          status: 400,
        },
      );
    }

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!user) {
      return NextResponse.json(
        {
          success: true,
          message:
            "If an account with that email exists, a reset link has been sent.",
        },
        { status: 200 },
      );
    }

    //Generate random token
    const resetToken = crypto.randomBytes(32).toString("hex");

    //Token expires after 15 minutes
    const resetTokenExpire = new Date(Date.now() + 15 * 60 * 1000);

    //save token in database

    user.resetToken = resetToken;
    user.resetTokenExpire = resetTokenExpire;

    await user.save();

    //Reset URL

    const resetUrl = `${process.env.Next_PUBLIC_APP_URL}/auth/reset-password/${resetToken}`;


    //Send email

    await sendEmail({
      to: user.email,

      subject: "Reset your Sukumart password",

      html: `
                  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">

          <h2>Reset Your Password</h2>

          <p>Hello ${user.name || "User"},</p>

          <p>
            We received a request to reset your Sukumart password.
          </p>

          <p>
            Click the button below to create a new password.
          </p>

          <a
            href="${resetUrl}"
            style="
              display: inline-block;
              padding: 12px 20px;
              background: #0055B3;
              color: white;
              text-decoration: none;
              border-radius: 6px;
            "
          >
            Reset Password
          </a>

          <p style="margin-top: 20px;">
            This link will expire in 15 minutes.
          </p>

          <p>
            If you did not request a password reset, you can ignore this email.
          </p>

          <p>
            Thanks,<br/>
            Sukumart Team
          </p>

        </div>
                `,
    });
    return NextResponse.json(
      {
        success: true,
        message:
          "If an account with that email exists, a reset link has been sent.",
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("forgot password error", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong. please try again.",
      },
      {
        status: 500,
      },
    );
  }
}
