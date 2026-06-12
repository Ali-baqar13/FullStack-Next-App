import { dbConnect } from "@/lib/dbConnet";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/model/User";
import mongoose from "mongoose";

export async function POST(request: Request) {

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

  const userId = user._id;
  const { acceptMessage } = await request.json();

  try {
    const updateUser = await UserModel.findByIdAndUpdate(
      userId,
      { isAcceptingMessages: acceptMessage },
      { new: true },
      );
      if (!updateUser) {
        return Response.json(
          {
            success: false,
            message: "User not found",
          },
          { status: 404 },
        );
      }
      return Response.json(
        {
          success: true,
          message: "Message acceptance status updated successfully",
              data: updateUser,
          updateUser: updateUser,
        },
        { status: 200 },
      );
  } catch (err) {
    console.log(err, "error in accepting message");
    return Response.json(
      {
        success: false,
        message: "Failed to accept message",
      },
      { status: 500 },
    );
  }
}

export async function GET(request: Request) {

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

    const userId = user._id;

    try {

        const foundUser = await UserModel.findById(userId);
        if (!foundUser) {
          return Response.json(
            {
              success: false,
              message: "User not found",
            },
            { status: 200 },
          );
        }
        return Response.json(
          {
            success: true,
            message: "User found",
            isAcceptingMessages: foundUser.isAcceptingMessages,
          },
          { status: 200 },
        );
        
    } catch (err) {

        console.log(err, "error in getting message acceptance status");
        return Response.json(
          {
            success: false,
            message: "Error in getting messages",
          },
          { status: 500 },
        );
        
    }
    
}
