import express, { Application } from "express"
import { appConfig } from "./app"
import { EnvironmentalVariables } from "./config/EnvironmentalVariables"
import { dbConfig } from "./config/db"

const app : Application = express()

appConfig(app)

dbConfig()

app.listen(EnvironmentalVariables.PORT, ()=>{
    console.log("listening to port", EnvironmentalVariables.PORT)
})