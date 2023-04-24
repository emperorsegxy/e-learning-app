import express, {Response} from "express";
import {courseCreationValidation} from "../validations/dtos/course";
import getErrorMsg from "../error-handlers/joi-handler";
import {createCourse, deleteACourse, deleteCourses, updateCourse} from "../services/course";
import ICourse from "../interfaces/ICourse";
import CourseError from "../validations/errors/CourseError";
import verifyUser from "../middlewares/VerifyUser";
import {JwtPayload} from "jsonwebtoken";

const courseRouter = express.Router()

courseRouter.post('/', verifyUser, async (req, res) => {
    const course: ICourse = req.body
    const { error } = courseCreationValidation(course)
    if (error) {
        res.status(400).send(getErrorMsg(error))
    }
    const owner = (req.decodedAuth as JwtPayload)?.id
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

courseRouter.put('/:id', verifyUser, async (req, res) => {
    if (!req.params.id) {
        return res.status(400).send({ message: "You have not passed in the 'id' of the course to be updated" })
    }
    if (!req.body) {
        return res.status(400).send({ message: "payload cannot be empty" })
    }
    if (!req.body.title && !req.body.description) {
        return res.status(400).send({ message: "There must be at least a property being changed" })
    }
    try {
        await updateCourse(req.params.id, req.body, (req.decodedAuth as JwtPayload)?.id)
        return res.status(200).send({
            message: 'Successfully modified given course'
        })
    } catch (e: any) {
        if (e.name === CourseError.name) {
            const { status, message } = e
            return res.status(status).send({ message })
        }
        return res.status(500).send(e.message || 'An error occurred')
    }
})

courseRouter.delete('/:id', verifyUser, async (req, res) => {
    if (!req.params.id) {
        return res.status(400).send({ message: "You have not passed in the 'id' of the course to be deleted" })
    }
    try {
        await deleteACourse(req.params.id, (req.decodedAuth as JwtPayload)?.id)
        return res.status(200).send({
            message: 'Successfully deleted course'
        })
    } catch (e: any) {
        if (e.name === CourseError.name) {
            const { status, message } = e
            return res.status(status).send({ message })
        }
        return res.status(500).send(e.message || 'An error occurred')
    }
})

courseRouter.delete('/', verifyUser, async (req, res: Response) => {
    const coursesIds = (req.query.courses as string)?.split(',') ?? []
    try {
        await deleteCourses((req.decodedAuth as JwtPayload)?.id, coursesIds)
        res.send({ message: "Successfully deleted courses" })
    } catch (e: any) {
        if (e.name === CourseError.name) {
            const { status, message } = e
            return res.status(status).send({ message })
        }
        return res.status(500).send(e.message || 'An error occurred')
    }
})

export default courseRouter
