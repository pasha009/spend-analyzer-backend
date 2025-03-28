import { Request, Response } from "express";

export const getDashboard = async (req: Request, res: Response) =>{
    return res.success("Hello",{"message":"Frontend connected?"});
};