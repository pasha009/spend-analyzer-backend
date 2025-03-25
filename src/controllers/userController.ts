import { Request, Response } from "express";
import User from "../models/userModel"

/**
 * Todo things:
 * review login process 
 * refresh token shouldnt be stored in user model, directly decode it while handling logout, in auth controller as well
 * access token to be added : Added
 * add authcontroller as well : added
 */

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

export const registerUser = async(req:Request, res:Response) =>{
    const {user, pwd}= req.body;
    if(!user || !pwd) return res.error("Username and password are required", null, 400);

    const duplicate= await User.findOne({username: user}).exec();

    if(duplicate) return res.error(`Username ${user} is already present`, null, 409);

    try{
        const hashPwd = await bcrypt.hash(pwd,10);        
        const newUser = new User({
            "username" : user,
            "password" : hashPwd
        });
        const result = await User.create(newUser);
        return res.success(`Created new user ${user}`,result,200);
    }catch(err: any) 
    {
        //server error 500
        return res.error(err.message, null, 500);
    }
}

export const handleLogin = async(req:Request, res:Response) =>{
    const {user, pwd}= req.body;
    if(!user || !pwd) res.error("Username and password are required", null, 400);

    const usr = await User.findOne({username : user}).exec();

    if(!usr) return res.error(`No user found with username : ${user}`, null, 401);

    try{
        const match = await bcrypt.compare(pwd, usr.password);
        if(match){
            const refreshToken = jwt.sign(
                {"username": usr.username},
                process.env.REFRESH_TOKEN_SECRET,
                {expiresIn : '1d'}           
            );

            const accessToken = jwt.sign(
                {"username": usr.username},
                process.env.ACCESS_TOKEN_SECRET,
                {expiresIn : '10m'}           
            );
            
            usr.refreshToken=refreshToken;
            await usr.save();
            res.cookie('jwt', refreshToken, {httpOnly: true, secure:true, maxAge: 24*60*60*1000});
            return res.success("Logged in successfully", accessToken,200);
        }
        else{
            return res.error(`Incorrect Password for username : ${user}`,401);
        }
    }catch(err: any){
        //server error 500
        return res.error(err.message, null, 500);
    }
}

export const handleLogout = async(req:Request, res:Response) =>{

    const cookies= req.cookies;
    if(!cookies?.jwt) return res.error("No Refresh Token present",204); //no content

    const refreshToken = cookies.jwt;

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err:any, decoded:any)=>{
            if(!decoded.username){
                return res.error("refreshToken not valid",400);
            }
            else{
                res.clearCookie('jwt', {httpOnly : true});
                return res.success(`Logged out user : ${decoded.username}`, 204);
            }
        }
    );

    const usr = await User.findOne({refreshToken:refreshToken}).exec();

    //no user but cookie was there
    if(!usr){
        res.clearCookie('jwt', {httpOnly : true, secure:true});
        return res.success('jwt cookie cleared', 204);
    }

    const result = await User.updateOne({refreshToken:refreshToken},{$unset: {refreshToken: refreshToken}});

    res.clearCookie('jwt', {httpOnly : true}); //secure true- only serves on https
    return res.success(`Logged out user : ${usr.username}`, 204);

}

export const refreshHandler = async(req:Request, res:Response) =>{
    const cookies= req.cookies;
    if(!cookies?.jwt) return res.error("No Refresh Token present",204); //no content

    const refreshToken = cookies.jwt;

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err:any, decoded:any)=>{
            if(!decoded.username){
                return res.error("refreshToken not valid",400);
            }
            else{
                const accessToken = jwt.sign(
                    {"username": decoded.username},
                    process.env.ACCESS_TOKEN_SECRET,
                    {expiresIn : '10m'}           
                );
                return res.success("Logged in successfully", accessToken,200);                
            }
        }
    );   
}

export const verifyJWT = (req:Request, res:Response , next:any)=>{
    const authHeader = req.headers.authorization || req.headers.Authorization;

    const authValue=(typeof(authHeader)!=="string")? '':authHeader;

    if (!authValue.startsWith('Bearer ')) return res.error("Forbidden",401);
    const token = authValue.split(' ')[1];
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err:Error, decoded:any) => {
            if(err){
                console.log("getting here?");
                return res.sendStatus(403);
            }
            res.locals.user = decoded.UserInfo.username;
            next();
        }
    );
}


