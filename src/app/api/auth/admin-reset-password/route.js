
import { NextResponse } from "next/server";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import dbConnect from "../../../../lib/dbConnect";
import User from "../../../../models/User";

export async function POST(request) {
  try {
    await dbConnect();

    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Token and password are required",
        },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Password must be at least 6 characters",
        },
        { status: 400 }
      );
    }

    // Hash token received from URL
    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    // Find admin with valid token
    const user = await User.findOne({
      resetToken: hashedToken,
      resetTokenExpire: {
        $gt: Date.now(),
      },
      role: "admin",
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Reset token is invalid or has expired",
        },
        { status: 400 }
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    user.password = hashedPassword;

    // Remove reset token after successful reset
    user.resetToken = null;
    user.resetTokenExpire = null;

    await user.save();

    return NextResponse.json(
      {
        success: true,
        message: "Password reset successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "Reset password error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error.message ||
          "Failed to reset password",
      },
      { status: 500 }
    );
  }
}





// import { NextResponse } from "next/server";
// import dbConnect from "../../../../lib/dbConnect";
// import User from "../../../../models/User";
// import bcrypt from "bcryptjs";



// export async function POST(request){
//     try{
//         await dbConnect();

//         const { token, password }= await request.json();

//         if(!token || !password){
//             return  NextResponse.json(
//                 {
//                     success: false,
//                     message: "Token and password are Required",
//                 },
//                 {
//                     status: 400
//                 }
//             )
//         }

//         if(password.length < 6){
//             return NextResponse.json(
//                 {
//                     success: false,
//                     message: "Password must be at least 6 characters",
//                 },
//                 {
//                     status: 400
//                 }
//             );
//         }

//         //find user with valid token
//         const user = await User.findOne({
//             resetToken: token,
//             resetTokenExpire: {
//                 $gt: new Date(),
//             },
//         });

//         if(!user){
//             return NextResponse.json(
//                 {
//                     success: false,
//                     message: "Invalid or expired reset link",
//                 },
//                 { status: 400 }
//             );
//         }

//         //hash new password
//         const hashedPassword= await bcrypt.hash(password, 10);
        
//         //update password
//         user.password= hashedPassword;

//         //Remove reset Token
//         user.resetToken=null;
//         user.resetTokenExpire= null;

//         await user.save();

//         return NextResponse.json(
//             {
//                 success: true,
//                 message: "Password Updated successfully",
//             },
//             { status: 200 }
//         );

//     }catch(error){
//         console.error("Reset password error", error);
//         return NextResponse.json(
//             {
//                 success: false,
//                 message: "Something went wrong",
//             },
//             { status: 500 }
//         )
//     }
// }



