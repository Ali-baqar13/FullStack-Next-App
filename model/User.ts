import mongoose, {Document,  Schema} from "mongoose";

export interface Message extends Document {
    content: string;
    createdAt: Date;

}

export interface User extends Document {
    username: {type:string, required: true, unique: true, trim:true};  // easy
    email: {type:string, required: true, unique: true, trim:true};     // easu
    password: string;  //easy
    isVerified: boolean;  // easy
    messages: Message[];   // easy
    verifyCode: string; // tp easy
    verifyCodeExpires: Date;  // Expirey of OTP
    isAcceptingMessages: boolean;  // tricky 

}

const MessageSchema: Schema<Message> = new Schema({
  content: { type: String, requirsed: true },
  createdAt: { type: Date, default: Date.now },
});

const UserSchema: Schema<User> = new Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    match: [/.+\@.+\..+/, "Please use a valid email address."],
  },
  password: { type: String, required: [true, "Password is required"] },
  verifyCode: { type: String, required: [true, "Verify code is required"] },
  verifyCodeExpires: { type: Date, default: Date.now },
  isVerified: { type: Boolean, default: false },
  isAcceptingMessages: { type: Boolean, default: true },
  messages: [MessageSchema]
});



const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", UserSchema)
export default UserModel;
