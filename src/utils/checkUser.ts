import { NextFunction, Request, Response } from "express";
import { AsyncHandler } from "./AsyncHandler";
import jwt from "jsonwebtoken"

export const checkUser = AsyncHandler(async (req:Request, res: Response, next: NextFunction)=> {
    const getToken = req.headers.authorization
    const getJwtToken  = getToken?.split(" ")[1]
    jwt.verify(getJwtToken as string, "ThisIsJWtToken", (error, action)=>{
        
    })
})