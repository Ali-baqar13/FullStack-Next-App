
'use client'
import axios from 'axios'
import { useFormik } from 'formik'
import { useParams, useRouter } from 'next/navigation'
// import { Input } from 'postcss'
import React from 'react'
import * as yup from 'yup'
import { Input } from "@/components/ui/input"
import {FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Loader2 } from 'lucide-react'
import { Button } from "@/components/ui/button";
import { toast } from 'sonner'
const verifySchema = yup.object({
    verifyOtp:  yup.string().length(6, 'verify code must have 6 digits')
})

const page = () => {
    const param = useParams()
    const [IsSubmitting, setIsSubmitting] = React.useState(false)
    
    const router = useRouter()
    //  i am skipppinh toast here we can add it later 
    const formik = useFormik({
        initialValues: { verifyOtp: ''},
        validationSchema:verifySchema,
        onSubmit : async (data: yup.InferType<typeof verifySchema>) => {
            setIsSubmitting(true)
            try{
                const response = await axios.post('/api/auth/verify-code', {
                    username:param.username,
                    code : data.verifyOtp
                })
              console.log(response, 'checking for data')
              if(response.data.success){
                toast.success('user verified successfully')
                router.replace('/sign-up')
              }else{
                toast.error(response.data.message || 'failed to verify user')
              }

                

            } catch(e){
                console.log(e, 'I am just checking for verify Code here')
                return Response.json({
                    success:false,
                    message:'having troubl ein sending OTP '
                })
            }
            finally {
        setIsSubmitting(false);
      }


        }
    })
  return (
   <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md  p-8 space-y-8 bg-white rounded-lgshadow-md">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">OTP</h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter your verify Otp
          </p>

          <form onSubmit={formik.handleSubmit}>
            <div className="space-y-4">
              <FieldGroup>
                <FieldLabel>verify Otp</FieldLabel>
                <Input
                  placeholder="Enter your verify Otp"
                  {...formik.getFieldProps("verifyOtp")}
                />
                {formik.touched.verifyOtp && formik.errors.verifyOtp ? (
                  <FieldError>{formik.errors.verifyOtp}</FieldError>
                ) : null}
              </FieldGroup>

           

             
            </div>

            <Button type="submit" disabled={IsSubmitting}>
              {IsSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  verifying...
                </>
              ) : (
                "Verify"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default page;
