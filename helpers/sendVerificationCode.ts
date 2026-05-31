import VerificationEmail from "@/email/emailVerification";
import { resend } from "@/lib/resend";
import { ApiResponse } from "@/types/ApiResponse";



export async function sendVerificationEmail(email:string, username:string, verifycode:string):Promise<ApiResponse>{
    try{
        console.log(email, 'i ma just checking email')
        await resend.emails.send({
            from:'onboarding@resend.dev',
            to:email,
            subject:'Verification Code',
            react:VerificationEmail({username,otp:verifycode})
            

        })
       return {success:true, message:'succesffult send email'}

    }catch(err){
        console.error('having problem in sending email', err)
        return { success:false, message:'failed to send verification email'}
    }
}


