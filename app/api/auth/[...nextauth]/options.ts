
import { dbConnect } from "@/lib/dbConnet";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id:'credentials',
            name:'Credentials',
            credentials: {

                username:{label:'Username', type:'text', placeholder:'Enter your username'},
                password:{label:'Password', type:'password', placeholder:'Enter your password'}

            },
            async authorize(credentials: any) : Promise<any> {
                await dbConnect();
                try {
                    const user = await UserModel.findOne({ $or: [{ email: credentials.identifier }, { password: credentials.identifier }] });
                    if (!user) {
                        throw new Error('No User Found with the provided credentials');
                    }
                    if (!user.isVerified) {
                        throw new Error('User is not verified');
                    }
                    const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
                    if (isPasswordValid) {
                        return user;
                    } else {
                        throw new Error('Invalid password');
                    }
                }catch(err){
                    console.error('error in authorize function', err)
                    throw new Error('Internal Server Error')
                    return null
                }
                
             }
        })

    ]

    callbaclks: {
        async jwt({ token, user }) { },
        async session({ session, token }) { },
    },
    
    pages: {
        signIn: '/sign-in',
    },
    session: {
        strategy: 'jwt',
    },

}