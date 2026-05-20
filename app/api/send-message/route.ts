import { dbConnect } from "@/lib/dbConnet";
import UserModel, { Message } from "@/model/User";



export async function POST(request :Request){
    await dbConnect()
    const {username, content} = await request.json()
    try{
       const user = await UserModel.findOne({username})
       if(!user){
        return Response.json({success:false, messages:'user not found'},{status:400})
       }
       if(!user.isAcceptingMessages){
        return Response.json({success:false, messages:'user us not accepting messages'},{status:400})

       }

       const newMessage = { content , createdAt:new Date()}
       user.messages.push(newMessage as Message) // must watch how ,essage here
       await user.save()
       return Response.json({
        success:true,
        messages:'messages sent succesfully'
       }, {status:200})
    }catch(err){

    }

}