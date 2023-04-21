import VerifyUser from "../middleware/VerifyUser";
import {createModule} from "../services/module";
import {JwtPayload} from "jsonwebtoken";
import express from "express";

const moduleRouter = express.Router()

moduleRouter.post(`/:courseId`, VerifyUser, async (req, res) => {
    try {
        const savedModule = await createModule(req.body, req.params.courseId, (req.decodedAuth as JwtPayload)?.id)
        res.status(201).send({
            message: 'Successfully created a module',
            module: savedModule
        })
    } catch (e: any) {
        console.error(e)
        res.send(e.message)
    }
})

export default moduleRouter
