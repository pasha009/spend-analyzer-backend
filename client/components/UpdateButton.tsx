"use client"

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { LoaderCircle } from "lucide-react";

const UpdateButton = () =>{
    const {pending} = useFormStatus();
    console.log('pending', pending);
    return(
        <Button type="submit" className="relative w-full font-semibold">
            <span className={pending? 'text-transparent': ''}>Update</span>
            {pending &&(
                <span className="absolute flex items-center justify-center text-gray-400">
                    <LoaderCircle className="animate-spin" />
                </span>
            )}
        </Button>
    )
}

export default UpdateButton;