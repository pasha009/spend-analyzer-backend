import React, {useEffect, useState} from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Expense Analyzer",
  description: "Generated using Next js",
};

export default function Page(){

  const [message, setMessage] = useState("Loading");
  useEffect( () =>{
    fetch("http://localhost:3123/expenses").then(
      response => response.json()
    ).then(
      data => { 
        console.log(data);
        setMessage(JSON.stringify(data.data));
      });
  }, []);
  return (
    <div>{message}</div>
  )
}

