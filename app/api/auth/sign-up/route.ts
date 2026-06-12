import { sendVerificationEmail } from "@/helpers/sendVerificationCode";
import { dbConnect } from "@/lib/dbConnet";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";

export async function POST(Request: Request) {
    await dbConnect()
    try {

        const { username, email, password } = await Request.json()
        const existingUserVerifiedByUsername = await UserModel.findOne({

            username,
            isVerified: true
        })

        if(existingUserVerifiedByUsername){
            return Response.json({
                success:false,
                message:'user find succesffuly you cant register now'

            },{status:400,})

        }
         const existingUserByEmail = await UserModel.findOne({
            email
         })

        const verifyCode = Math.floor(10000 + Math.random() * 900000).toString()
        
         if(existingUserByEmail){
            
            if(existingUserByEmail.isVerified){
                return Response.json(
                    {
                        success: false,
                        message: 'user already exist'
                    },
                    {
                        status: 400
                    }
                )
            }
            
            else
            {
                const hashPassword = await bcrypt.hash(password, 10)
                existingUserByEmail.password = hashPassword,
                existingUserByEmail.verifyCode = verifyCode,
                existingUserByEmail.verifyCodeExpires = new Date(Date.now()+3600000) 
                await existingUserByEmail.save()}
        }else{
            const bcryptPassword = await bcrypt.hash(password,10)
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours()+1)

            const newUser = new UserModel({
                username,
                    email,
                    password: bcryptPassword,
                    isVerified: false,
                    messages: [],
                    verifyCode: verifyCode,
                    verifyCodeExpires: expiryDate,
                    isAcceptingMessages: true
            })
            await newUser.save()

            const emailResposne= await sendVerificationEmail(email,username, verifyCode)
            if(!emailResposne.success){
                return Response.json({
                    success:false,
                    message:'Email not send due to some intrruption'
                },
            {
                status:500,

            })
            }} return Response.json({
            success:true,
            message:'user register successfully please verify email',
            

        },{status:201})


    } catch (err) {
        console.log(err, 'Error in registering user')

        Response.json({
            success: false,
            message: 'Error in registering user',

        }, { status: 500 })

    }
}