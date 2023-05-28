import {Document} from "mongoose"


export interface Iuser extends Document {
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    phoneNumber: string,
    isEmailVerfied: boolean,
    country: string,
    isAuthType: string,
    twoFa: Object
}