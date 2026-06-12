import { dbConnect } from "@/lib/dbConnet"
import UserModel from "@/model/User"


export async function POST(request:Request){
    await dbConnect()

    try{

        const { username, code } = await request.json()

        const decodedUsername = decodeURIComponent(username) // this is because we are expecting name from query
        const user = await UserModel.findOne({username:decodedUsername})
        if(!user){
            return Response.json({
                success:false,
                message:'cant find user'
            },{status:500})
        }
        const isCodeExpire = user.verifyCode == code
        const isCodeNotExpired = new Date(user.verifyCodeExpires) > new Date

        if(isCodeExpire && isCodeNotExpired){
            user.isVerified = true
            await user.save()
        }


    }catch(err){

        console.log('error in verify user',err)
        return Response.json({success:false, message:'Error in verifying user'},{
            status:500
        })

    }

}