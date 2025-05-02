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


/**
 * register a new user
 * @param req  request object
 * @param res  response object
 * @returns 
 */
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
        return res.error(err.message, null, 500);
    }
}

/**
 * handle user login
 * @param req request object : format : {"username" : username, "password" : password}
 * @param res response object
 * @returns refresh token and access token both in data, refreshtoken in cookie
 * @description : refresh token is stored in cookie, access token is sent in response
 * @description : refresh token is used to get new access token, access token is used to access protected routes
 */
export const handleLogin = async(req:Request, res:Response) =>{
    const {username, password}= req.body;
    if(!username || !password) res.error("Username and password are required", null, 400);

    const usr = await User.findOne({username : username}).exec();

    if(!usr) return res.error(`No user found with username : ${username}`, null, 401);

    try{
        const match = await bcrypt.compare(password, usr.password);
        if(match){
            const refreshToken = jwt.sign(
                {"username": usr.username},
                process.env.REFRESH_TOKEN_SECRET,
                {expiresIn : '1d'}           
            );
            const accessToken = jwt.sign(
                {"username": usr.username},
                process.env.ACCESS_TOKEN_SECRET,
                {expiresIn : '10sec'}           
            );
            usr.refreshToken=refreshToken;
            await usr.save();
            res.cookie('jwt', refreshToken, {httpOnly: true, secure:true, maxAge: 24*60*60*1000});
            return res.success("Logged in successfully", {'accessToken':accessToken,'refreshToken': refreshToken},200);
        }
        else{
            return res.error(`Incorrect Password for username : ${username}`,null,401);
        }
    }catch(err: any){
        return res.error(err.message, null, 500);
    }
}

/**
 * handle user logout
 * @param req request object : format : {"refreshToken" : refreshToken}
 * @param res response object
 * @description : clears refresh token from cookie and removes refresh token from user model
 * @returns 
 */

export const handleLogout = async(req:Request, res:Response) =>{
    const {refreshToken}= req.body;
    if(!refreshToken) return res.error("No Refresh Token present",null,204); //no content
    const usr = await User.findOne({refreshToken:refreshToken}).exec();
    if(!usr){
        return res.success("Logged out",null,204);
    }
    await User.updateOne({refreshToken:refreshToken},{$unset: {refreshToken: refreshToken}});
    res.clearCookie('jwt', {httpOnly : true}); //secure true- only serves on https
    return res.success("Logged out",null,204);
}

/**
 * refresh access token using refresh token
 * @param req request object
 * @param res response object
 * @returns access token in response
 * @description : refresh token is used to get new access token, access token is used to access protected routes
 */
export const refreshHandler = async(req:Request, res:Response) : Promise<any> =>{
    console.log("Entering refresh handler");

    const cookies= req.cookies;
    console.log(cookies);
    if(!cookies) return res.status(401).json({"message" : "cookies are required"});

    const refreshToken = cookies.refreshToken;

    if(!refreshToken) return res.error("No Refresh Token present",null,204); //no content

    const usr = await User.findOne({refreshToken: refreshToken}).exec();
    if(!usr) return res.sendStatus(403); //forbidden

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err:any, decoded:any)=>{
            if(!decoded.username){
                return res.error("refreshToken not valid",null,400);
            }
            else if(err){
                console.log(err);
                return res.error("Forbidden",err,403);
            }
            else{
                const accessToken = jwt.sign(
                    {"username": decoded.username},
                    process.env.ACCESS_TOKEN_SECRET,
                    {expiresIn : '10m'}           
                );
                return res.success("Access Token refreshed successfully", {'accessToken':accessToken}, 200);                
            }
        }
    );   
}

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
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err:Error, decoded:any) => {
            if(err){
                console.log(err);
                return res.error('Forbidden',err,403);
            }
            res.locals.user = decoded.username;
            next();
        }
    );
}


