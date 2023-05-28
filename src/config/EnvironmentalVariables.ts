import dotenv from "dotenv"

dotenv.config()

export const EnvironmentalVariables = {
    PORT : process.env.PORT,
    MONGOOSE_URL: process.env.MONGOOSE_URL,
    MAILcHIMP_API_KEY: process.env.MAILcHIMP_API_KEY,
    SERVER_PREFIX: process.env.SERVER_PREFIX,
    LIST_ID: process.env.LIST_ID,
    CLIENT_SECRET: process.env.CLIENT_SECRET,
    API_KEY: process.env.API_KEY,
    REDIRECT_URL: process.env.REDIRECT_URL,
    CLIENT_ID: process.env.CLIENT_ID,
    REFRESH_TOKEN: process.env.REFRESH_TOKEN,
    JSON_WEB_TOKEN: process.env.JSON_WEB_TOKEN,
}