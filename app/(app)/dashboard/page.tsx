import { AcceptMessageSchema } from "@/schemas/AcceptMessageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import axios, { AxiosError } from "axios";
import { error } from "console";
import { useFormik } from "formik";
import { useSession } from "next-auth/react";
import React, { useCallback, useEffect, useState } from "react";

const page = () => {
  const [messages, setMessages] = useState<any>([]); // type habveto wrk on
  const [isSwitchLoad, setIsSwitchLoad] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message: any) => message._id !== messageId));
  };

  const { data: session } = useSession();
  const formik = useFormik({
    initialValues: {
      acceptMessage: false,
    },
    validationSchema: AcceptMessageSchema,
    onSubmit: () => {},
  });
  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoad(true);
    try {
      const response = await axios.get<ApiResponse>("api/accept-message");
      formik.setFieldValue("acceptMessage", response.data?.isAcceptingMessages);
    } catch (err) {
      console.log(err);
      //  have tot send resposne
      // const axiosError = error as AxiosError<ApiResponse>
    } finally {
      setIsSwitchLoad(false);
    }
  }, [formik]);
  const fetchMessages = useCallback(async (refresh: boolean = false) => {
    setIsSwitchLoad(false);
    setIsLoading(true);
    try {
      const response = await axios.get<ApiResponse>("api/get-message");
      setMessages(response.data?.messages);
    } catch (err) {
      console.log(err);
    } finally {
      setIsSwitchLoad(false);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!session || !session.user) return;
    fetchMessages();
    fetchAcceptMessage();
  }, [fetchMessages, fetchAcceptMessage, session]);

  const handleSwitchChage = async () => {
    try {
      const response = await axios.post<ApiResponse>("api/accept-message", {
        acceptMessage: !formik.values.acceptMessage,
      });
      formik.setFieldValue("acceptMessage", response.data.isAcceptingMessages);
    } catch (err) {
    } finally {
    }
  };
  return <div>dashboard</div>;
};

export default page;
