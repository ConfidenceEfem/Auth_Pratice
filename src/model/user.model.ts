import { Iuser } from "@src/interface/user.interface"
import {model,Schema} from "mongoose"

const UserSchema = new Schema<Iuser>({
    firstName: {type: String,required: true,trim: true},
    lastName: {type: String,required: true,trim: true},
    email: {type: String,required: true,trim: true,unique: true},
    phoneNumber: {type: String,trim: true},
    country: {type: String,required: true,trim: true,max: 2, default: "NG"},
    isEmailVerfied: {type: Boolean,required: true,trim: true, default: false},
    password: {type: String,required: true},
    isAuthType: {type: String,required: true,trim: true, default: "email"},
    twoFa: {type: Object}
}, {
    timestamps: true
})

export const UserModel = model("user", UserSchema)