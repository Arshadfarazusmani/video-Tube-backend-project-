// verify if the user is loggedin

import { api_error } from "../utils/api-error.js";
import { asynchandler } from "../utils/async-handler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/users.model.js";

export const verifyJWT=asynchandler(async(req,resizeBy,next)=>{
    try {
        const token = req.cookies?.accessToken || req.header ("Authorization")?.replace("Bearer","")
    
        if(!token){
            throw new api_error(401,"unauthorized request ")
        }
    
        const decoded_Token= jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
    
    
       const user =  await User.findById(decoded_Token?._id).select("-password -refreshToken")
    
    
       if(!user){
        throw new api_error(401,"Invalid Access Token");
        
       }
    
       req.user=user
       next()
    } catch (error) {
        throw new api_error(401,error?.message||"Invalid acceess token")
        
    }
})

