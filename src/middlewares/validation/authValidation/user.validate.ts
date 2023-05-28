import { NextFunction, Request, Response } from "express";
import { validator } from "../validator";
import { UserValidationSchema } from "./user.validate.schema";

export const ValidateUserRegistration = (req: Request, res: Response, next: NextFunction) => validator(UserValidationSchema.register, req.body, next)

export const validateUserLogin = (req: Request, res: Response, next: NextFunction) => validator(UserValidationSchema.login, req.body, next)