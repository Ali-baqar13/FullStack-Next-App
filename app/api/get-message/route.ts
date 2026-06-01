import { dbConnect } from "@/lib/dbConnet";
import UserModel from "@/model/User";
import mongoose from "mongoose";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";



export async function GET(request:Request){
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user;

    if (!session || !session.user) {
      return Response.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 },
      );
    }

    const userId = new mongoose.Types.ObjectId(user._id);

    try{
        const user = await UserModel.aggregate([
            {$match:{id:userId},
            },{$unwind: '$message'},
            {$sort:{'messages.createdAt':-1}},
            {$group: {_id:'$_id', messages:{$push:'$messages'}}}  // tom make all messages on only one user thta have token simpy
        ])

        if(!user ||  user.length==0){
            return Response.json({
                success:false,
                messages:'user not found'
            },{status:401})

             
        }
        return Response.json({
            success:false,
            messages:user[0].messages  //aggregate return array
        }, {status:200})
    } catch(err){
        console.log(err, 'error in get messages')
    }
}