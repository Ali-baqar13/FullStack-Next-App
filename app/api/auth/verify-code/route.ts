import { dbConnect } from "@/lib/dbConnet";
import UserModel from "@/model/User";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, code } = await request.json();

    const decodedUsername = decodeURIComponent(username);

    const user = await UserModel.findOne({
      username: decodedUsername,
    });

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 },
      );
    }

    const isCodeValid = user.verifyCode === code;

    const isCodeNotExpired = new Date(user.verifyCodeExpires) > new Date();

    console.log("Code Valid:", isCodeValid);
    console.log("Code Not Expired:", isCodeNotExpired);

    if (isCodeValid && isCodeNotExpired) {
      user.isVerified = true;
      await user.save();

      return Response.json(
        {
          success: true,
          message: "User verified successfully",
        },
        { status: 200 },
      );
    }

    return Response.json(
      {
        success: false,
        message: "Invalid or expired verification code",
      },
      { status: 400 },
    );
  } catch (err) {
    console.error("Error verifying user:", err);

    return Response.json(
      {
        success: false,
        message: "Error verifying user",
        error: String(err),
      },
      { status: 500 },
    );
  }
}
