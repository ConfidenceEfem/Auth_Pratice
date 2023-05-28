import { NextFunction, Request, Response } from "express";
import { AsyncHandler } from "../../utils/AsyncHandler";
import { Iuser } from "../../interface/user.interface";
import { UserModel } from "../../model/user.model";
import speakeasy from "speakeasy"
import { HttpCode } from "../../utils/AppError";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import otpGenerator from "otp-generator"
import { sendEmailToUsers } from "../../config/sendMail";
import { OtpModel } from "../../model/otp.model";
import { EnvironmentalVariables } from "../../config/EnvironmentalVariables";

export const userRegistration = AsyncHandler(async (req: Request<{}, {}, Iuser>, res: Response, next: NextFunction) => {
    const {firstName,lastName,email,password} = req.body

    const findUser = await UserModel.findOne({email})

    const saltPassword = await bcrypt.genSalt(10)


    const generateOtp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        specialChars: false,
        digits: true,
        lowerCaseAlphabets: false
        
    }
    )

    const generateVerifyKey = otpGenerator.generate(25)

  
    if(findUser){
        return res.status(HttpCode.BAD_REQUEST).json({message: "User already exist"})
    }else{

        

        const otp = new OtpModel({
        otp: generateOtp,
          email,
          verificationKey: generateVerifyKey  
        })

        otp.otp = await bcrypt.hash(otp.otp, saltPassword)
        otp.verificationKey = await bcrypt.hash(otp.verificationKey, saltPassword)

        await otp.save()


        const hashPassword  = await bcrypt.hash(password, saltPassword)

        sendEmailToUsers(email,"Verify Your Email", `<h3>Use this otp to verify your email ${generateOtp}. Otp expires after 10mins</h3>`)

        await UserModel.create({
            firstName,lastName,email,password: hashPassword, twoFa: {type: "email", verificationKey: generateVerifyKey}
        })
        
        return res.status(HttpCode.CREATED).json({message: "Check your mail to verify email", data: {type: "email", verificationKey: generateVerifyKey}})
    }   
})


export const verifyEmail = AsyncHandler(async (req: Request, res: Response, next: NextFunction) => {

    const {email,verificationKey, otp} = req.body

    const otpHolder = await OtpModel.find({email})
    if(otpHolder.length === 0){
        res.status(HttpCode.NOT_FOUND).json({message: "You use an expired OTP"})
    }else{
        const rightOtpFind = otpHolder[otpHolder.length - 1]
        const validUser = await bcrypt.compare(otp, rightOtpFind.otp)
        const validVerificationKey = await bcrypt.compare(verificationKey, rightOtpFind.verificationKey)
       if(validVerificationKey){
        if(validUser){
            const findUser = await UserModel.findOneAndUpdate(email,{isEmailVerfied: true }, {new: true})

            await OtpModel.deleteMany({email: rightOtpFind.email})

            res.status(HttpCode.OK).json({message: "Email Verified Successfully. You can now sign in"})

        }else{
           res.status(HttpCode.BAD_REQUEST).json({message: "Invalid OTP"}) 
        }
       }else{
        res.status(HttpCode.BAD_REQUEST).json({message: "Expired Verification Key"})
       }
    }


})

const sendTwoFactorAuthorizationByEmail = async (otp: string, email: string,verifyKey:string) => {

    const salt = await bcrypt.genSalt(10)



    const otpObject = new OtpModel({
        verificationKey: verifyKey,
        otp: otp,
        email: email
    })

    otpObject.verificationKey = await bcrypt.hash(otpObject.verificationKey, salt)
    otpObject.otp = await bcrypt.hash(otpObject.otp, salt)

    otpObject.save()

    sendEmailToUsers(email,"Complete Two Factor Authorization", `<h4>Copy and paste the otp : ${otp} to complete your 2FA. Otp expires in 5 minutess</h4>`)
}


export const userBeingSignedIn = AsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const {email,password} = req.body
    const findUser = await UserModel.findOne({email})
    if(findUser){

      const checkPassword = await bcrypt.compare(password, findUser?.password)
      if(!checkPassword){
        res.status(HttpCode.BAD_REQUEST).json({message: "Incorrect email or password"})
      }else{
        const generateVerifyKey = otpGenerator.generate(25)


        const generateOtp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            specialChars: false,
            digits: true,
            lowerCaseAlphabets: false
        })
    
       if( findUser.isAuthType === "email"){
        console.log(generateOtp)
        sendTwoFactorAuthorizationByEmail(generateOtp,email, generateVerifyKey)
       }
        res.status(HttpCode.OK).json({message: " Proceed to Complete 2FA", data: {twoFa: {verificationKey: generateVerifyKey, type: findUser.isAuthType, email: email}}})
      }
    }else{
        res.status(HttpCode.BAD_REQUEST).send("Incorrect email or password")
    }

    
})



export const completeTwoFaByEmail = async (email: string,verificationKey: string,otp: string,res: Response) => {
    const otpHolder = await OtpModel.find({email})
    if(otpHolder.length === 0){
        res.status(HttpCode.NOT_FOUND).json({message: "Expired OTP"})
    }else{
        const rightOtpFind = otpHolder[otpHolder.length - 1]
        const validOtp = await bcrypt.compare(otp, rightOtpFind.otp)
        // const validVerificationKey = await bcrypt.compare(verificationKey, rightOtpFind.verificationKey)
        // console.log("hey key")
        // if(validVerificationKey){
            if(validOtp){
                const findUser = await UserModel.findOne({email})

                const token = jwt.sign(
                   { firstName: findUser?.firstName,lastName:findUser?.lastName, email: findUser?.email, phoneNumber:findUser?.phoneNumber, isEmailVerified: findUser?.isEmailVerfied, isAuthType: findUser?.isAuthType}, EnvironmentalVariables.JSON_WEB_TOKEN as string, {expiresIn: "3d"}
                )

              await  OtpModel.deleteMany({email})

                res.status(HttpCode.OK).json({message: "Two Factor Authorization Completed", data: {token, data: findUser}})
            }else{
                res.status(HttpCode.BAD_REQUEST).json({message: "Invalid Otp"})
            }
        // }
        // else{
        //     res.status(HttpCode.BAD_REQUEST).json({message: "Input verification key"})
        // }
       
    }
}

   

export const completeTwoFactorAuthorization = AsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const {otp, email, verificationKey,type} = req.body
    if(type === "email"){
        completeTwoFaByEmail(email,verificationKey,otp,res)
    }else{

    }

})


// export const verifyEmail = AsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
//     const verifyKey = jwt.verify(token, "verifyEmail", (err, {payload})=>{
//         if(err){
//             res.status(5)
//         }
//     })
// })

