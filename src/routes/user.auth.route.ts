import { TwoFactorCompletion, emailVerification, registerUser, signInUser } from "../controller/auth/user.auth.controller"
import {Router} from "express"

const UserRouter = Router()

UserRouter.post("/signup", registerUser)
UserRouter.post("/verify-email", emailVerification)
UserRouter.post("/signin", signInUser)
UserRouter.post("/complete-2fa", TwoFactorCompletion)

export default UserRouter