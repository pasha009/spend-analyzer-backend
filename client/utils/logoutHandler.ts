import axios from "axios";

export const logout = async () =>{
    localStorage.removeItem("accessToken");
    const refreshToken = "refreshToken";
    const data = {"refreshToken":refreshToken};
    const response = await axios.post("http://localhost:3123/users/logout", data, {
        headers: { "Content-Type": "application/json" },
    });
    document.cookie = `${refreshToken}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`;

    // const dispatch = useAppDispatch();
    // dispatch(clearUser());

    window.location.href = "/login";
}