"use client";


import * as z from "zod"

import Heading from "@/components/heading";
import { Divide, ImageIcon, MessageSquare } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";

import Image from "next/image";
import { Card } from "@/components/ui/card";
import { CardFooter } from "@/components/ui/card";

import { amountOptions,formSchema } from "./contstant";
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
import { useState } from "react";
import { Empty } from "@/components/empty";
import { Loader } from "@/components/loader";

import { Select, SelectGroup } from "@/components/ui/select";
import { SelectTrigger } from "@/components/ui/select";
import { SelectValue } from "@/components/ui/select";
import { SelectItem } from "@/components/ui/select";
import { SelectContent } from "@/components/ui/select";

import { cn } from "@/lib/utils";
import { UserAvatar } from "@/components/user-avatar";
import { BotAvatar } from "@/components/bot-avatar";
import { Images } from "openai/resources/images.mjs";

export default function ImagePage(){
    
    const router = useRouter();
    const [images, setImages] = useState<string[]>([])

    const form = useForm<z.infer<typeof formSchema>>({
        resolver:zodResolver(formSchema),
        defaultValues:{
            prompt:"",
            amount:"1",
            resolution:"512x512"
        }

    });

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {

        try {
    
          setImages([])
          const response = await axios.post("/api/image", values);
          // console.log('FULL RE:', response)
          const urls = response.data;
          setImages(urls)
          console.log(urls)
          form.reset();

        } catch (error: any) {
    
          // TODO: Open Pro Modal
          console.log(error);
    
        } finally {
          router.refresh();
        }
    
      };
    

    return(
        <div>
            <Heading 
            title ="Image Generation"
            description="Turn your ideas into images"
            icon={ImageIcon}
            iconColor="text-pink-700"
            bgColor="bg-pink-700/10"/>
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
                                                placeholder="Children fighting a dragon"

                                                {...field}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )
                                } }
                            />
                            <FormField 
                                control = {form.control}
                                name ="amount"
                                render = {({field}) => (
                                    <FormItem className="col-span-12
                                    lg:col-span-2">
                                        <Select
                                            disabled={isLoading}
                                            onValueChange={field.onChange}
                                            value = {field.value}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue defaultValue={field.value}/>
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {amountOptions.map((option)=>(
                                                    <SelectItem key={option.value}
                                                    value={option.value}>
                                                        {option.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )}

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
                        <div className="p-20">
                            <Loader/>
                        </div>
                    )}
                    {images.length===0 && !isLoading && (
                        <Empty label="No images generated."/>
                    )} 
                    <div>
                        Images will be rendered here
                    </div>

                </div>
            </div>
        </div>
    )
}