import { dbConnect } from "@/lib/dbConnet";
import {z} from 'zod';
import { userNameValidation } from "@/schemas/signUpSchema";
import UserModel from "@/model/User";


const usernameQuerySchema = z.object({
    username:userNameValidation
})


export async function GET(request : Request){

    
    await dbConnect()
    try{

        const {searchParams} = new URL(request.url)
        const queryParams = {username:searchParams.get('username')}

        // validation with zod

        const result = usernameQuerySchema.safeParse(queryParams)
        console.log(result,'result')
        if(!result.success){
            const usernameErr = result.error.format().username?._errors || []
            return Response.json({
                success:false,
                message:'Invalid Query Parameter'
            },{status:400})
        }
        const username = result.data
        const existingUsername = await UserModel.findOne({username, isVerified:true})
        if(existingUsername){
            return Response.json({
                success:true,
                message:'username already taken'
            },{status:400})

        }
         return Response.json({
                success:true,
                message:'username is unique'
            },{status:400})



    }
    catch(err){
        console.log('error in checking username', err)
        return Response.json({
            success:false,
            message:'error in checking username'
        },{status:500})
    }
}