import { RequestHandler } from "express";
import { completeTwoFactorAuthorization, userBeingSignedIn, userRegistration, verifyEmail } from "../../services/auth/user.auth.services";

export const registerUser : RequestHandler = (req,res,next) => userRegistration(req,res,next)

export const emailVerification : RequestHandler = (req,res,next) => verifyEmail(req,res,next)

export const signInUser : RequestHandler = (req,res,next) => userBeingSignedIn(req,res,next)

export const TwoFactorCompletion : RequestHandler = (req,res,next) => completeTwoFactorAuthorization(req,res,next)