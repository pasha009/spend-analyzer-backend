import React, { useEffect, useState } from "react";

export default function Page() {
  const [message, setMessage] = useState<string | null>(null);

  // const results = await fetch("http://localhost:3123/expenses");
  // const data = await results.json();
  // console.log(data);

  useEffect(() => {
    fetch("http://localhost:3123/expenses")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setMessage(JSON.stringify(data.data));
      })
      .catch((error) => {
        console.error("Error fetching expenses:", error);
        setMessage("Failed to load data.");
      });
  }, []);

  if (message === null) {
    return <div>Loading...</div>;
  }

  return(<div className='max-w-5xl mx-auto px-5 flex justify-between items-center gap-4'>
    {message}
    </div>);
}