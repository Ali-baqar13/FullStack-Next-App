"use client";

import React from "react";
import { signIn } from "next-auth/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

const validationSchema = Yup.object({
  identifier: Yup.string().required("Email or Username is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const Page = () => {
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      identifier: "",
      password: "",
    },

    validationSchema,

    onSubmit: async (values, { setSubmitting }) => {
      try {
        const result = await signIn("credentials", {
          redirect: false,
          identifier: values.identifier,
          password: values.password,
        });

        if (result?.error) {
          toast.error(result.error);
          return;
        }

        toast.success("Successfully signed in");
        router.replace("/dashboard");
      } catch (error) {
        console.error(error);
        toast.error("Something went wrong");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Sign In</h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter your credentials to sign in
          </p>
        </div>

        <form onSubmit={formik.handleSubmit}>
          <div className="space-y-4">
            <FieldGroup>
              <FieldLabel>Email or Username</FieldLabel>
              <Input
                placeholder="Enter email or username"
                {...formik.getFieldProps("identifier")}
              />

              {formik.touched.identifier && formik.errors.identifier && (
                <FieldError>{formik.errors.identifier}</FieldError>
              )}
            </FieldGroup>

            <FieldGroup>
              <FieldLabel>Password</FieldLabel>
              <Input
                type="password"
                placeholder="Enter password"
                {...formik.getFieldProps("password")}
              />

              {formik.touched.password && formik.errors.password && (
                <FieldError>{formik.errors.password}</FieldError>
              )}
            </FieldGroup>
          </div>

          <Button
            type="submit"
            disabled={formik.isSubmitting}
            className="w-full mt-6"
          >
            {formik.isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing In...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Page;
