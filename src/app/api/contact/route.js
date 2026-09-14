import { NextResponse } from "next/server";
import dbConnect from "../../../lib/dbConnect";
import Contact from "../../../models/Contact";

export async function POST(request) {
  try {
    await dbConnect();

    const body = await request.json();

    const { name, email, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        {
          success: false,
          message: "All fields are required",
        },
        { status: 400 }
      );
    }

    const contact = await Contact.create({
      name,
      email,
      subject,
      message,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Message sent successfully",
        contact,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST contact error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}


export async function GET() {
  try {
    await dbConnect();

    const contacts = await Contact.find().sort({
      createdAt: -1,
    });

    return NextResponse.json(
      {
        success: true,
        contacts,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET CONTACT API ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}