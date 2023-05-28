import { EnvironmentalVariables } from "./EnvironmentalVariables";
import nodemailer from "nodemailer"
import {google} from "googleapis"
import { Response } from "express";
import { HttpCode } from "../utils/AppError";


const oAuthPass = new google.auth.OAuth2(
    EnvironmentalVariables.CLIENT_ID,
    EnvironmentalVariables.CLIENT_SECRET,
    EnvironmentalVariables.REDIRECT_URL
  );
  
  oAuthPass.setCredentials({ refresh_token: EnvironmentalVariables.REFRESH_TOKEN });

 export const sendEmailToUsers = async (email: string, title: string, content: string, res?: Response) => {
    try {
      const createToken = await oAuthPass.getAccessToken();
  
     

      const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          type: 'OAuth2',
          user: 'smartdevopss@gmail.com',
          clientId: EnvironmentalVariables.CLIENT_ID,
          clientSecret: EnvironmentalVariables.CLIENT_SECRET,
          refreshToken: EnvironmentalVariables.REFRESH_TOKEN,
          accessToken: createToken.token as string
        },
      });
  
      const mailOptions = {
        from: `Auth Pratice <"confidenceefem1@gmail.com">`,
        to: email,
        subject: `${title}`,
        html: `${content}`,
      };
  
      const result = transporter.sendMail(mailOptions, (err: any, info: any) => {
        if (err) {
          console.log(err.message);
          if(res !== undefined){
            res.status(HttpCode.SERVER_ERROR).json({message: err.message})
          }
        } else {
          console.log(info.response);
        }
      });
  
      return result;
    } catch (error) {
      return error;
    }
  };