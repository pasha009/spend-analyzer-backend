import React, { useEffect, useState } from "react";
import axios from "axios";
import {authorize} from "@/utils/Authorize";
import { useRouter } from "next/navigation";
import { headers } from "next/headers";

export default function Page() {
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();  

  const fetchData = async () => {
      const authRes = await authorize();
      console.log(authRes.authReq); // Access the resolved object
      console.log(authRes.code);

      if(authRes.code===0){
        // console.log("Authorization failed returning to login");
        setMessage("Authorization failed returning to login");
        router.push('/login');
      }
      else if(authRes.code===1){
        console.log("Access token present");

        const response = await fetch("http://localhost:3123/expenses", {
            headers: authRes.authReq.headers
          });
        if (!response.ok) {
          localStorage.removeItem("accessToken");
          router.push('/');
        }
        else{
        console.log("Response:", response.json().then((data) => {
          console.log("Fetch Data:", data.data);
          setMessage(JSON.stringify(data.data));
        }));
        }
        console.log("Data pulled in");        
      }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (message === null) {
    return <div>Loading...</div>;
  }

  return(<div className='max-w-5xl mx-auto px-5 flex justify-between items-center gap-4'>
    {message}    
    </div>);
}