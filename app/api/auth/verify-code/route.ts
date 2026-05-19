import { dbConnect } from "@/lib/dbConnet"
import UserModel from "@/model/User"


export async function POST(request:Request){
    await dbConnect()

    try{

        const {username, code} = await request.json()

        const decodedUsername = decodeURIComponent(username)
        const user = UserModel.findOne({username:decodedUsername})
        if(!user){
            return Response.json({
                success:false,
                message:'cant find user'
            },{status:500})
        }


    }catch(err){

        console.log('error in verify user',err)
        return Response.json({success:false, message:'Error in verifying user'},{
            status:500
        })

    }

}