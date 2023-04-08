import express, {RequestHandler} from "express";
import {courseCreationValidation} from "../validations/dtos/course";
import getErrorMsg from "../error-handlers/joi-handler";
import {createCourse} from "../services/course";
import ICourse from "../interfaces/ICourse";
import CourseError from "../validations/errors/CourseError";
import verifyUser from "../middleware/VerifyUser";

const courseRouter = express.Router()

courseRouter.post('/', verifyUser as RequestHandler, async (req, res) => {
    const course: ICourse = req.body
    const { error } = courseCreationValidation(course)
    if (error) {
        res.status(400).send(getErrorMsg(error))
    }
    // @ts-ignore
    const owner = req.decodedAuth.id
    try {
       const savedCourse = await createCourse(course, owner)
        return res.status(201).send({
            message: 'Successfully created a course',
            course: savedCourse
        })
    } catch (e: any) {
        if (e.name === 'CourseError') {
           return res.status(e.status).send(e.message)
        }
        return res.status(500).send('An error occurred')
    }
})

export default courseRouter
