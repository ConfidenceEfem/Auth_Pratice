import { AppError, HttpCode } from "@src/utils/AppError"
import { NextFunction } from "express"
import joi from "joi"

export const validator  = (Schema: joi.ObjectSchema, body: Object, next: NextFunction) => {
   

    try{
        const value = Schema.validate(body, {
            allowUnknown: true,
            abortEarly: false,
            stripUnknown: true
        })
    
        value.error? next(new AppError({message: value.error.details[0].message, httpCode: HttpCode.UNPROCESSIBLE_IDENTITY})) : next()
    }catch(err: any){
        next(new AppError({message: err.message, httpCode: HttpCode.BAD_REQUEST}))
    }
}