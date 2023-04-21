import express, {RequestHandler} from "express";
import VerifyUser from "../middleware/VerifyUser";
import {createModule} from "../services/module";

const moduleRouter = express.Router()

moduleRouter.post(`/:courseId`, VerifyUser as RequestHandler, async (req, res) => {
    try {
        // @ts-ignore
        const savedModule = await createModule(req.body, req.params.courseId, req.decodedAuth.id)
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
