import express from "express";
import registerNewUser from "../services/auth/registerNewUser";
import {
    loginValidation,
    registerValidation,
    resetPasswordValidation,
    verifyEmailValidation
} from "../validations/dtos/auth";
import getErrorMsg from "../error-handlers/joi-handler";
import logUserIn from "../services/auth/logUserIn";
import VerifyUser from "../middlewares/VerifyUser";
import {getAllUsers} from "../services/users";
import {JwtPayload} from "jsonwebtoken";
import ApiBaseErrorResponse from "../utils/errors/ApiBaseErrorResponse";
import {sendOTP, verifyOTP} from "../services/auth/manageOTP";
import HttpStatus from "../utils/httpStatus";
import * as crypto from "node:crypto";
import OtpSession from "../db/OtpSession";
import OTP from "../db/OTP";
import User from "../db/User";
import {securePassword} from "../utils/bcryptor";

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

router.post('/forgot-password', async (req, res) => {
    if (!req.body.email) return res.status(HttpStatus.BAD_REQUEST).send(ApiBaseErrorResponse(HttpStatus.BAD_REQUEST, new Error('Email is empty')))
    try {
        const {otp} = await sendOTP(req.body)
        res.status(HttpStatus.OK).send({message: 'Successfully sent otp to ' + req.body.email, data: {otp}})
    } catch (e: any) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(ApiBaseErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, e))
    }
})

router.post('/forgot-password/confirm-otp', async (_req, res) => {
    const body = _req.body
    console.log(body, 'confirm')
    const { error } = verifyEmailValidation(body)
    if (error)
        return res.send(HttpStatus.BAD_REQUEST).send({message: getErrorMsg(error)})
    try {
        await verifyOTP(body)
        const sessionToken = crypto.randomBytes(32).toString('hex')
        await OtpSession.create({
            email: body.email,
            token: sessionToken
        })
        await OTP.deleteMany({email: body.email})
        res.status(HttpStatus.OK).send({message: 'Successfully confirmed otp', data: {sessionToken}})
    } catch (e: any) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(ApiBaseErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, e))
    }
})

router.post('/forgot-password/reset-password', async (req, res) => {
    const body = req.body
    console.log(body, 'reset ps')
    const { error } = resetPasswordValidation(body)
    console.log(error, 'error')
    if (error)
        return res.send(HttpStatus.BAD_REQUEST).send({message: getErrorMsg(error)})
    try {
        const { sessionToken, password } = body
        console.log('reset ps session to ' + sessionToken)
        const session = await OtpSession.findOne({token: sessionToken})

        if (!session) {
            return res.status(HttpStatus.BAD_REQUEST).send({message: "Session is expired"})
        }

        const user = await User.findOne({email: session.email})

        if (!user) {
            return res.status(HttpStatus.BAD_REQUEST).send({message: "User is not found"})
        }

        user.password = await securePassword(password)
        user.save()

        await OtpSession.deleteMany({email: session.email})
        return res.status(HttpStatus.OK).send({message: 'Successfully reset password'})
    } catch (e: any) {
        console.error(e)
    }
})

export default router
