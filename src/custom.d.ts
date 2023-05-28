import {Response,Request} from "express"
import { Iuser } from "./interface/user.interface"

declare module "express-serve-static-core" {
    interface Request {
        user?: Iuser
    }
}