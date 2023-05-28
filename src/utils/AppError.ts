export enum HttpCode  {
    OK = 200,
    BAD_REQUEST = 400,
    NOT_FOUND = 404,
    SERVER_ERROR = 500,
    CREATED = 201,
    UNPROCESSIBLE_IDENTITY = 422   
}

interface ErrorArgs {
    message: string,
    httpCode: HttpCode,
    isOperational?: boolean,
    name?: string
}

export class AppError extends Error {

    public readonly name : string
    public readonly httpCode : HttpCode
    public readonly isOperational : boolean = true
    

    constructor(args: ErrorArgs){
        super(args.message)

        Object.setPrototypeOf(this, new.target.prototype)

        this.httpCode = args.httpCode
        if(args.isOperational !== undefined){
            this.isOperational = args.isOperational
        }
        this.name = args.name || "ERROR"

        Error.captureStackTrace(this)
    }
}