import {Header} from "@/components/Header";
import {Footer} from "@/components/Footer";
import { Geist, Geist_Mono } from "next/font/google";


const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
  });
  
  const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
  });
  
  export default function PageLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>){
    return(
        <div
          className={`antialiased min-h-screen mt-8 mb-12`}
        >
          <Header />
          {children}
          <Footer />
        </div>
    );
}