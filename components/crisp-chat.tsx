"use client";

import { useEffect } from "react";
import {Crisp} from "crisp-sdk-web";

export default function CrispChat(){
    useEffect(()=>{
        Crisp.configure("26e37138-6bcf-4f92-8681-3e60a77635e7");
    },[])

    return null
}
