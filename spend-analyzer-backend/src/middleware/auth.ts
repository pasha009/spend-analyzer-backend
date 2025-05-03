const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
import { Request, Response } from "express";

/**
 * verify JWT token
 * @param req request object
 * @param res response object
 * @param next next function
 * @description : verifies the JWT token and adds the user to the request object
 * @returns 
 */
export const verifyJWT = (req:Request, res:Response , next:any)=>{
    const authHeader = req.headers.authorization || req.headers.Authorization;

    const authValue=(typeof(authHeader)!=="string")? '':authHeader;

    if (!authValue.startsWith('Bearer ')) return res.error("Forbidden : Authorisation Header shouldnt be empty and should start with beares",null,401);
    const token = authValue.split(' ')[1];
    // console.log(token);
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err:Error, decoded:any) => {
            if(err){
                console.log(err);
                return res.error('Forbidden',token,403);
            }
            res.locals.username = decoded.username;
            res.locals.user_id = decoded.user_id;
            next();
        }
    );
}
