"use client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Geist, Geist_Mono } from "next/font/google";


const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
  });
  
  const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
  });

export default function PageLayout (
    {children}:{children: React.ReactNode}) {
    return(
        <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
        >
          <Header />
          {children}
          <Footer />
        </body>
        </html>
    );
}