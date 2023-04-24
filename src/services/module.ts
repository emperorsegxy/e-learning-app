import IModule, {ModuleType} from "../interfaces/IModule";
import Module from "../db/Module";
import User from "../db/User";
import Course from "../db/Course";
import {Request} from "express";

export const createModule = async (module: IModule, courseId: string, creatorId: string) => {
    if (!await User.findById(creatorId).exec()) {
        throw new Error('User does not exist')
    }
    if (!await Course.findById(courseId).exec()) {
        throw new Error('Course does not exist')
    }
    try {
        const m = await Module.create({ ...module, courseId })
        return await m.save()
    } catch (e: any) {
        throw new Error(e)
    }
}

export const deleteModulesBelongingToCourse = async (courseId: string) => {
    await Module.deleteMany({ courseId }).exec()
}

export const doesTypeAndContentMatch = (req: Request, moduleType: ModuleType) => {
    if (moduleType !== 'file') return typeof req.body.content === 'string'
    return !!req.file?.mimetype
}
