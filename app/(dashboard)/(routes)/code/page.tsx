"use client";


import * as z from "zod"

import Heading from "@/components/heading";
import { Code, Divide, MessageSquare } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";

import ReactMarkdown from "react-markdown";

import { formSchema } from "./contstant";
import { Input } from "@/components/ui/input"
import { Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage, } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import { Empty } from "@/components/empty";
import { Loader } from "@/components/loader";
import { cn } from "@/lib/utils";
import { UserAvatar } from "@/components/user-avatar";
import { BotAvatar } from "@/components/bot-avatar";
import { useProModal } from "@/app/hooks/use-pro-modal";

export default function CodePage (){

    const proModal = useProModal();
    const router = useRouter();
    const [messages, setMessages] = useState<ChatCompletionMessageParam[]>([]);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver:zodResolver(formSchema),
        defaultValues:{
            prompt:""
        }
    });

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values:z.infer<typeof formSchema>) => {
        try {
            const userMessage : ChatCompletionMessageParam = {
                role:"user",
                content : values.prompt,
            };
            
            const newMessages = [...messages, userMessage];

            const response = await axios.post("/api/code", {
                messages: newMessages,
            })

            setMessages((current)=> [...current, userMessage, response.data]);

            form.reset();

            

        } catch (error:any) {
            
            if (error?.response?.status === 403){
                proModal.onOpen();
            }

        }finally{
            router.refresh();
        }
    };

    return(
        <div>
            <Heading 
            title ="Code Generation"
            description="Generate complex code quick"
            icon={Code}
            iconColor="text-green-700"
            bgColor="bg-green-700/10"/>
            <div className="px-4 lg:px-8">
                <div>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}
                        className="rounded-lg
                        border
                        w-full
                        p-4
                        px-3
                        md:px-6
                        focus-within:shadow-sm
                        grid
                        grid-cols-12
                        gap-2"
                        >

                            <FormField 
                                name="prompt"
                                render={ ( {field} ) => {
                                    return(
                                        <FormItem className="
                                        col-span-12 
                                        lg:col-span-10 ">
                                            <FormControl className="m-0 p-0">
                                                <Input 
                                                className="border-0 outline-none
                                                focus-visible:ring-0
                                                focus-visible:ring-transparent"
                                                
                                                disabled={isLoading}
                                                placeholder="Write python code for finding the sum of two numbers"

                                                {...field}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )
                                } }
                            />
                            <Button className="col-span-12 lg:col-span-2 w-full"
                            disabled={isLoading}>
                                Generate
                            </Button>
                        </form>
                    </Form>
                </div>
                <div className="space-y-4 mt-4">
                    {isLoading && (
                        <div className="p-8 rounder-lg w-full flex items-center justify-center bg-muted">
                            <Loader/>
                        </div>
                    )}
                    {messages.length===0 && !isLoading && (
                        <Empty label="No conversation started"/>
                    )} 
                    <div className="flex flex-col-reverse gap-y-4">
                                {messages.map((message, index) => (
                                <div key={index}
                                    className={cn("p-8 w-full flex items-start gap-x-8 rounded-lg",message.role==="user"? "bg-white border border-black/10":"bg-muted")}                            >
                                    {message.role === "user" ? <UserAvatar/> : <BotAvatar/> }                                 
                                    <ReactMarkdown
                                        components={{
                                        pre: ({ node, ...props }) => (
                                            <div key={index} className="overflow-auto w-full mt-2 bg-black text-white p-2 m-5 rounded-lg flex justify-between items-start pr-9 ">
                                                <pre {...props} />
                                                <button onClick={() => {navigator.clipboard.writeText(props.children.props.children)}}>Copy</button>
                                            </div>
                                        ),
                                        code: ({ node, ...props }) => (
                                            <code className="bg-black/10 rounded-lg p-1" {...props} />
                                        )
                                        }}
                                        className='text-sm overflow-hidden leading-7 '
                                        >
                                            {Array.isArray(message.content)
                                            ? message.content
                                                .map((part, partIndex) => {
                                                    if ("text" in part) {
                                                    return <span key={partIndex}>{part.text}</span>;
                                                    } else {
                                                    // Handle 'ChatCompletionContentPartImage' case here
                                                    return null;
                                                    }
                                                })
                                                .join("")
                                            : message.content || ""}
                                    </ReactMarkdown>
                                    
                                </div>
                                ))}
                    </div>
                </div>
            </div>
        </div>
    )
}