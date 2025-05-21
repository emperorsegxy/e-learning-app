import express from "express";
import registerNewUser from "../services/auth/registerNewUser";
import {loginValidation, registerValidation, verifyEmailValidation} from "../validations/dtos/auth";
import getErrorMsg from "../error-handlers/joi-handler";
import logUserIn from "../services/auth/logUserIn";
import VerifyUser from "../middlewares/VerifyUser";
import {getAllUsers} from "../services/users";
import {JwtPayload} from "jsonwebtoken";
import ApiBaseErrorResponse from "../utils/errors/ApiBaseErrorResponse";
import {verifyOTP} from "../services/auth/manageOTP";
import HttpStatus from "../utils/httpStatus";

const router = express.Router()

router.post('/register', async (req, res) => {
    const { error } = registerValidation(req.body)
    if (error) {
        return res.status(400).send(getErrorMsg(error))
    }
    try {
        const otp = await registerNewUser(req.body)
        res.status(HttpStatus.CREATED).send({message: 'Successfully registered user', data: {otp}})
    } catch (e: any) {
        res.status(400).send(ApiBaseErrorResponse(HttpStatus.BAD_REQUEST, e))
    }
})

router.post('/login', async (req, res) => {
    const { error } = loginValidation(req.body)
    if (error) {
        return res.status(400).send(getErrorMsg(error))
    }
    try {
        const response = await logUserIn(req.body)
        res.send(response)
    } catch (e: any) {
        console.error(e)
        res.status(HttpStatus.BAD_REQUEST).send(ApiBaseErrorResponse(HttpStatus.BAD_REQUEST, e))
    }
})

router.post('/verify-email', async (req, res) => {
    const body = req.body
    const { error } = verifyEmailValidation(body)
    if (error)
        return res.send(HttpStatus.BAD_REQUEST).send({message: getErrorMsg(error)})
    try {
        await verifyOTP(body)
        res.status(HttpStatus.OK).send({message: 'Successfully verified email'})
    } catch (e: any) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(ApiBaseErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, e))
    }
})

router.get('/users', VerifyUser, async (req, res) => {
    // @ts-ignore
    const users = await getAllUsers((req.decodedAuth as JwtPayload)?.id)
    res.send(users)
})

export default router
