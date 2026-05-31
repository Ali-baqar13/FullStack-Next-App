"use client";

import React, { useEffect } from "react";
import { signIn } from "next-auth/react";
import { useDebounceCallback, useDebounceValue } from "usehooks-ts";
import { useFormik } from "formik";
import { signUpSchema } from "@/schemas/signUpSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { toast } from "sonner";
import { Input } from "@/components/ui/input"
import * as Yup from "yup";import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";


// export default function Component() {
//   const { data: session } = useSession();
//   if (session) {
//     return (
//       <>
//         Signed in as {session.user.email} <br />
//         <button onClick={() => signOut()}>Sign out</button>
//       </>
//     );
//   }
//   return (
//     <>
//       Not signed in <br />
//       <button onClick={() => signIn()}>Sign in</button>
//     </>
//   );
// }

const page = () => {
  const [username, setUsername] = React.useState("");
  const [usernameMessage, setUsernameMessage] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [isCheckingUsername, setIsCheckingUsername] = React.useState(false);
  const [IsSubmitting, setIsSubmitting] = React.useState(false)
  const debounceUsername = useDebounceCallback(setUsername, 300);
  const router = useRouter()
    const signUpSchema = Yup.object({
      
      identifier: Yup.string().email({ message: "Invalid email address" }),
      password: Yup
        .string()
        .min(6, "password must be at least 6 characters")
        .max(100, "password must be at most 100 characters"),
    });


  const formik = useFormik({
    initialValues: {
     
      identifier: "",
      password: ""
    },
    validationSchema: signUpSchema,
    onSubmit: async (values) => {
      const result = await signIn('credentails', {
        redirect:false,
        identifier: values.identifier,
        password: values.password

      })
      if (result?.error) {
        toast.error('something went wrong')
      }
      if(result?.url){
        router.replace('/dashboard')
      }
    }
  });

  // useEffect(() => {
  //   const checkUsernameUnique = async () => {
  //     if (username) {
  //       setIsCheckingUsername(true);
  //       setUsernameMessage("");
  //       try {
  //         const response = await axios.get(
  //           `/api/auth/check-username-unique?username=${debounceUsername}`,
  //         );
  //         setUsernameMessage(response.data.message);
  //       } catch (error) {
  //         const axiosError = error as AxiosError<ApiResponse>;
  //         axiosError.response?.data?.message ?? "Error checking username";
  //       } finally {
  //         setIsCheckingUsername(false);
  //       }
  //     }
  //   };
  //   checkUsernameUnique();
  // }, [username]);

  // const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
  //   setIsSubmitting(true);
  //   try {
  //     const response = await axios.post<ApiResponse>("/api/auth/sign-up", data);
  //     console.log(response,'checking for data')
  //     // toast?.({
  //     //   title: "Success",
  //     //   description: response.data.message,
  //     //   type: "success",
  //     // })
  //     // router.push(`/verify/${username}`); //username bhi miljayeg or code bhi
  //   }catch(err){}
  // };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md  p-8 space-y-8 bg-white rounded-lgshadow-md">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Sign In</h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter your credentials to sign in
          </p>

          <form onSubmit={formik.handleSubmit}>
            <div className="space-y-4">
              

              <FieldGroup>
                <FieldLabel>Email</FieldLabel>
                <Input
                  placeholder="Enter your email"
                  {...formik.getFieldProps("email")}
                />
                {formik.touched.identifier && formik.errors.identifier ? (
                  <FieldError>{formik.errors.identifier}</FieldError>
                ) : null}
              </FieldGroup>

              <FieldGroup>
                <FieldLabel>Password</FieldLabel>
                <Input
                  type="password"
                  placeholder="Enter your password"
                  {...formik.getFieldProps("password")}
                />
                {formik.touched.password && formik.errors.password ? (
                  <FieldError>{formik.errors.password}</FieldError>
                ) : null}
              </FieldGroup>
            </div>

            <Button type="submit" disabled={IsSubmitting}>
              {IsSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
  
};

export default page;
