import mongoose from "mongoose";
import { EnvironmentalVariables } from "./EnvironmentalVariables";

export const dbConfig = () => {
    const url = EnvironmentalVariables.MONGOOSE_URL

    const connectDb = mongoose.connect(url as string).then((db)=>{
        console.log("Connected to db", db.connection.host)
    }).catch((err)=>{
        console.log("mongodb error", err)
    })


    return connectDb

   
    
}