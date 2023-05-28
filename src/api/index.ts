import UserRouter from "../routes/user.auth.route"
import {Router} from "express"


const router = Router()

router.use("/auth", UserRouter)

export default router