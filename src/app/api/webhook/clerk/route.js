import { verifyWebhook } from "@clerk/nextjs/webhooks";
import dbConnect from "../../../../lib/dbConnect";
import User from "../../../../models/User";
import { NextResponse } from "next/server";




export async function POST(request){
    try{

        //verify that the request came from Clerk
        const event= await verifyWebhook(request);

        //connecgt to MongoDB
        await dbConnect();

        //Get event type
        const eventType= event.type;

        console.log("Clerk webhook received :", eventType);

        //user created
        if(eventType === "user.created"){
            const { id, first_name, last_name, email_addresses, } = event.data;
            
            const email = email_addresses?.[0]?.email_address?.toLowerCase() || "";
            
            const name= [first_name, last_name].filter(Boolean).join(" ") || "User";

        await User.findOneAndUpdate(
            {
                clerkId: id
            },
            {
                clerkId : id,
                name,
                email,
                
            },
            {
                upsert:true,
                new: true,
                
                setDefaultsOnInsert: true,
            }
        );
        console.log("user created in MongoDB", id);
    }

        //user updated
        else if(eventType === "user.updated"){

            const { id, first_name, last_name, email_addresses }= event.data;

            const email = email_addresses?.[0]?.email_address?.toLowerCase() || "";

            const name= [first_name, last_name].filter(Boolean).join(" ") || "User";

            await User.findOneAndUpdate(
                {
                    clerkId: id
                },
                {
                    name, email
                },
                {
                    new: true,
                }
            );
            console.log("User updated in MongoDB:", id);

        }

        //user deleted
        else if(eventType === "user.deleted"){
            const { id } = event.data;

            await User.findOneAndDelete({
                clerkId: id,
            })
            console.log("user deleted from MongoDB:", id);
        }

        //other events

        else{
            console.log("Unhandled Clerk event :", eventType);
        }

        return NextResponse.json(
            {
                success: true,
                message: "Webhook processed successfully",
            },
            {
                status: 200
            }
        )

    }catch(error){
        console.log("Clerk Webhook error",error);

        return NextResponse.json(
            {
                success: false,
                message: "Webhook Verification or processing failed",
            },
            {
                status: 400,
            }
        )
    }
}