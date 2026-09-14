import nodemailer from "nodemailer";



const transporter = nodemailer.createTransport(
    {
        service: "gmail",
        
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD,
        },
    }
);

export const sendEmail= async( {to, subject, html})=>{
    try{

        const info= await transporter.sendMail({
            from: `"SukuMart" <${process.env.EMAIL}>`,
            to,
            subject,
            html,
        });
        console.log("Email sent", info.messageId)

    }catch(error){
        console.log("Email sending error:", error);
        throw error;
    }
}