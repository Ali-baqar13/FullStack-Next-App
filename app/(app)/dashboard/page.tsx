import MessageCard from "@/components/common/mesageCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { AcceptMessageSchema } from "@/schemas/AcceptMessageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import axios, { AxiosError } from "axios";
import { error } from "console";
import { useFormik } from "formik";
import { Loader2, RefreshCcw } from "lucide-react";
import { register } from "module";
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
  if (!session || !session.user) {
    return <div>Log in</div>;
  }
  return
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{" "}
        <div className="flex items-center">
          {/* link of url here we have to define */}
          {/* <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-full p-2 mr-2"
          />
          <Button onClick={copyToClipboard}>Copy</Button> */}
        </div>
      </div>

      <div className="mb-4">
        <Switch
          checked={formik.values.acceptMessage}
          onCheckedChange={handleSwitchChage}
          disabled={isSwitchLoad}
        />

        <span className="ml-2">
          Accept Messages: {formik.values.acceptMessage ? "On" : "Off"}
        </span>
      </div>
      <Separator />

      <Button
        className="mt-4"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          fetchMessages(true);
        }}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <MessageCard
              key={message._id}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <p>No messages to display.</p>
        )}
      </div>
    </div>;
};

export default page;
