import { NextFunction, Request, Response } from "express"
import { AppError, HttpCode } from "../../utils/AppError"

const devErrorHandler = (err: AppError, res: Response) => {
    return res.status(HttpCode.SERVER_ERROR).json({
        err: err,
        stack: err.stack,
        name: err.name,
        message: err.message

    })
}

export const ErrorHandler = (err: AppError, req:Request, res:Response, next:NextFunction) => {
    devErrorHandler(err,res)
}