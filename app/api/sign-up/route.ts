import { dbConnect } from "@/lib/dbConnet";


export async function POST (Request:Request)
{
    await dbConnect()
    try{

        const {username, email, password} = await Request.json()


    } catch(err){
        console.log(err, 'Error in registering user')

        Response.json({
            success:false,
            message:'Error in registering user',

        }, {status:500})

    }
}