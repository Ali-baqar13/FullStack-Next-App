import { dbConnect } from "@/lib/dbConnet";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import UserModel, { User } from "@/model/User";


export async function DELETE(request: Request, { params }: { params: { messageId: string } })

{
    const messageId = params.messageId;
    await dbConnect();
    const session = await getServerSession(authOptions);

    const user: User = session?.user as User;

    if (!session || !session.user) {
        return Response.json(
            {
                success: false,
                message: "Unauthorized",
            },
            { status: 401 },
        );
    }

    try {
        const updatedResult = await UserModel.updateOne(
            { _id: user._id },
            { $pull: { messages: { _id: messageId } } }
        );
        if (updatedResult.modifiedCount === 0) {
            return Response.json(
                {
                    success: false,
                    message: "Message not found or already deleted",
                },
                { status: 404 },
            )
        }
    } catch(err){
        console.log(err, 'error in delete message')
    }
    

}