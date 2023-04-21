import express from "express";
import registerNewUser from "../services/auth/registerNewUser";
import {loginValidation, registerValidation} from "../validations/dtos/auth";
import getErrorMsg from "../error-handlers/joi-handler";
import logUserIn from "../services/auth/logUserIn";
import VerifyUser from "../middleware/VerifyUser";
import {getAllUsers} from "../services/users";
import {JwtPayload} from "jsonwebtoken";

const router = express.Router()

router.post('/register', async (req, res) => {
    const { error } = registerValidation(req.body)
    if (error) {
        return res.status(400).send(getErrorMsg(error))
    }
    try {
        await registerNewUser(req.body)
        res.status(201).send({message: 'Successfully registered user'})
    } catch (e: any) {
        res.status(400).send(e.message)
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
        res.status(400).send(e.message)
    }
})

router.get('/users', VerifyUser, async (req, res) => {
    // @ts-ignore
    const users = await getAllUsers((req.decodedAuth as JwtPayload)?.id)
    res.send(users)
})

export default router
