import express,{ Application, Request, Response, Router } from "express"
import { ErrorHandler } from "./middlewares/error"
import router from "./api"

export const appConfig = (app: Application) => {
    app.use(express.json())
    .get("/", (req:Request,res: Response)=>{
        res.send("Welcome to my world")
    })
    .use("/api", router)
    .all("*", (req:Request,res: Response)=>{
        res.status(404).json({message: "This route is not found", data: req.originalUrl})
    })
    .use(ErrorHandler)
}