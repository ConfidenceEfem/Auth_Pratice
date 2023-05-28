import joi from "joi"

export const UserValidationSchema = {
    register: joi.object({
        firstName: joi.string().required(),
        lastName: joi.string().required(),
        email: joi.string().email().required(),
        password: joi.string().required(),
    }),
    login: joi.object({
        email: joi.string().email().required(),
        password: joi.string().required(),
    })
}