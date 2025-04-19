import {redirect } from "next/navigation";
import axios from "axios";

const authorize = async() =>{

    const accessToken = localStorage.getItem("accessaToken");

    if(!accessToken){
    const refreshToken = localStorage.getItem("refreshToken");
        if(!refreshToken) redirect('/login');
        try {
            const data = {"refreshToken":refreshToken};
            const response = await axios.post("http://localhost:3123/users/refreshAccessToken", data, {
                headers: { "Content-Type": "application/json" },
            });

            if(!response.status){
                console.log(response.data);
                redirect('/login');
            }
            else{
                console.log(response);
                const accessToken=response.data.data.accessToken;
                localStorage.setItem("accessToken", accessToken);
            }
        }catch(error:any){
            console.error("Server Error: Token issue");
            redirect('/login');
        }
    }
    else{
        
        
    }
}

export default authorize;
