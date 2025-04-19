const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
import { Request, Response } from "express";

export const verifyJWT = (req:Request, res:Response , next:any)=>{
    const authHeader = req.headers.authorization || req.headers.Authorization;

    const authValue=(typeof(authHeader)!=="string")? '':authHeader;

    if (!authValue.startsWith('Bearer ')) return res.error("Forbidden : Authorisation Header shouldnt be empty and should start with beares",null,401);
    const token = authValue.split(' ')[1];
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err:Error, decoded:any) => {
            if(err){
                return res.error('Forbidden',err,403);
            }
            res.locals.user = decoded.UserInfo.username;
            next();
        }
    );
}

