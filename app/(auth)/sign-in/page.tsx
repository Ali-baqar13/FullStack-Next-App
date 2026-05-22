"use client";

import React, { useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { useDebounceCallback, useDebounceValue } from "usehooks-ts";
import { useForm } from "react-hook-form";
import { signUpSchema } from "@/schemas/signUpSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { toast } from "sonner";
import { Input } from "@/components/ui/input"

import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

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
  const [IsSubmitting, setIsSubmitting] = React.useState(false);

  const debounceUsername = useDebounceCallback(setUsername, 300);
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });
  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (username) {
        setIsCheckingUsername(true);
        setUsernameMessage("");
        try {
          const response = await axios.get(
            `/api/auth/check-username-unique?username=${debounceUsername}`,
          );
          setUsernameMessage(response.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          axiosError.response?.data?.message ?? "Error checking username";
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };
    checkUsernameUnique();
  }, [username]);

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>("/api/auth/signup", data);
      // toast?.({
      //   title: "Success",
      //   description: response.data.message,
      //   type: "success",
      // })
      // router.push(`/verify/${username}`); //username bhi miljayeg or code bhi
    }catch(err){}
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md  p-8 space-y-8 bg-white rounded-lgshadow-md">
        <div className="text-center">
          {/* <Form {...form}> */}
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name">Username</FieldLabel>
                <Input
                  {...form.register("username")}
                  name="username"
                  placeholder="Username"
                  onChange={(e) => {
                    form.setValue("username", e.target.value);
                    debounceUsername(e.target.value);
                  }}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="Password">Password</FieldLabel>
                <Input
                  {...form.register("password")}
                  name="password"
                  type="password"
                  placeholder="Password"
                  onChange={(e) => {
                    form.setValue("password", e.target.value);
                  }}
                />
                <FieldError>Choose another Password.</FieldError>
              </Field>

              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  {...form.register("email")}
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Email"
                  onChange={(e) => {
                    form.setValue("email", e.target.value);
                  }}
                />
                <FieldError>Choose another Email.</FieldError>
              </Field>
              <Field orientation="horizontal"></Field>
            </FieldGroup>

            <Button
              type="submit"
              disabled={IsSubmitting}
              className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
            >
              {IsSubmitting ? <Loader2 /> : "Sign Up"}
            </Button>
          </form>
          ``
          {/* </Form> */}
        </div>
      </div>
    </div>
  );
  
};

export default page;
