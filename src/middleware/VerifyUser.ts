import jwt from 'jsonwebtoken'
import {NextFunction, Request, Response} from "express";
import dotenv from "dotenv";

dotenv.config()

declare module "express" {
    interface Request {
        decodedAuth: string | jwt.JwtPayload
    }
}

const VerifyUser = (req: Request, res: Response, next: NextFunction) => {
    const retrieveTokenFromHeaders = () : string | undefined => {
        const auth = req.headers['authorization']
        return (auth as string)?.split(/\s/)?.[1]
    }
    const token: string | undefined = req.body.token || req.query.token || retrieveTokenFromHeaders()
    if (!token) {
        res.status(403).send('Action is forbidden')
    }
    if (token) {
        try {
            req.decodedAuth = jwt.verify(token, process.env.JWT_TOKEN_KEY as string)
        } catch (e: any) {
            return res.status(401).send('Invalid token')
        } finally {
            next()
        }
    }
}

export default VerifyUser
