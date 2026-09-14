import { NextResponse } from "next/server";
import dbConnect from "../../../../lib/dbConnect";
import User from "../../../../models/User";
import bcrypt from "bcryptjs";



export async function POST(request){
    try{
        await dbConnect();

        const { token, password }= await request.json();

        if(!token || !password){
            return  NextResponse.json(
                {
                    success: false,
                    message: "Token and password are Required",
                },
                {
                    status: 400
                }
            )
        }

        if(password.length < 6){
            return NextResponse.json(
                {
                    success: false,
                    message: "Password must be at least 6 characters",
                },
                {
                    status: 400
                }
            );
        }

        //find user with valid token
        const user = await User.findOne({
            resetToken: token,
            resetTokenExpire: {
                $gt: new Date(),
            },
        });

        if(!user){
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid or expired reset link",
                },
                { status: 400 }
            );
        }

        //hash new password
        const hashedPassword= await bcrypt.hash(password, 10);
        
        //update password
        user.password= hashedPassword;

        //Remove reset Token
        user.resetToken=null;
        user.resetTokenExpire= null;

        await user.save();

        return NextResponse.json(
            {
                success: true,
                message: "Password Updated successfully",
            },
            { status: 200 }
        );

    }catch(error){
        console.error("Reset password error", error);
        return NextResponse.json(
            {
                success: false,
                message: "Something went wrong",
            },
            { status: 500 }
        )
    }
}