import axios from "axios";
import { headers } from "next/headers";

export const authorize = async () : Promise<{authReq:any, code:number}> =>{

    const accessToken = localStorage.getItem("accessToken");
    const req = { headers: {} }; 
    if(accessToken){
        req.headers= { "Authorization": `Bearer ${accessToken}`};
    }
    else{
        console.log("Access token not found");
        const getCookie = (name: string): string | null => {
            const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
            return match ? decodeURIComponent(match[2]) : null;
        };

        const refreshToken = getCookie("refreshToken"); // Replace "jwt" with the name of your JWT cookie
        console.log("Refresh Token from Cookies:", refreshToken);

        if(!refreshToken) return {"authReq":req, "code":0};
        try {
            console.log("is it entering here");
            const data = {"refreshToken":refreshToken};
            const response = await axios.get("http://localhost:3123/users/refreshAccessToken", {
                headers: { "Content-Type": "application/json" },
                withCredentials: true
            });

            console.log("Response:", response);

            if(response.status!=200){
                console.log(response.data);
                return {"authReq":req, "code":0};            
            }
            else{
                console.log(response);
                const newAccessToken = response.data.data.accessToken;
                localStorage.setItem("accessToken", newAccessToken); // Store as a plain string
                console.log(newAccessToken);
                req.headers = { Authorization: `Bearer ${newAccessToken}` };            }
        }catch(error:any){
            console.error("Server Error: Token issue");
            return {"authReq":req, "code":0};        
        }
    }
    return {"authReq":req, "code":1};
}

export default authorize;
