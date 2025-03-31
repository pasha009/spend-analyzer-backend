"use client";

import React, {useEffect, useState} from "react";
export default function Page(){

  // const results = await fetch("http://localhost:3123/expenses");
  // const data = await results.json();
  // console.log(data);

  const [message, setMessage] = useState("Loading");
  useEffect( () =>{
    fetch("http://localhost:3123/expenses").then(
      response => response.json()
    ).then(
      data => { 
        console.log(data);
        setMessage(JSON.stringify(data.data));
      }).catch((error) => {
        console.error("Error fetching expenses:", error);
        setMessage("Failed to load data.");
      });
  }, []);

  return (
    <div>{JSON.stringify(message)}</div>
  )
}

