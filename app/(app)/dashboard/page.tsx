import { AcceptMessageSchema } from '@/schemas/AcceptMessageSchema'
import axios from 'axios'
import { useFormik } from 'formik'
import { useSession } from 'next-auth/react'
import React, { useCallback, useState } from 'react'

const page = () => {
    const [messages, setMessages] = useState([])
    const [isSwitchLoad, setIsSwitchLoad] =  useState(false)
    const handleDeleteMessage =(messageId:string)=> {
        setMessages(messages.filter((message:any)=> message._id !== messageId))

    }
    const fetchMessage = useCallback>(async()=>{
        setIsSwitchLoad(true)
        try{
            const response = await axios.get('api/accept-message')
            formik.setFieldValue('acceptMessage',response.data?.isAcceptingMessages)
        } catch(err) {
            console.log(err)
            //  have tot send resposne
        }




    })
    const {data:session} = useSession()
    const formik = useFormik({
        initialValues: {
            acceptMessage:false
        },
        validationSchema:AcceptMessageSchema,
        onSubmit:()=>{

        }
    })
  return (
    <div>dashboard</div>
  )
}

export default page