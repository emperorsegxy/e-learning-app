import IModule from "../interfaces/IModule";
import Module from "../db/Module";
import User from "../db/User";
import Course from "../db/Course";

export const createModule = async (module: IModule, courseId: string, creatorId: string) => {
    try {
        if (!await User.find({ id: creatorId }).exec()) {
            throw new Error('User does not exist')
        }
        if (!await Course.find({ id: courseId }).exec()) {
            throw new Error('Course does not exist')
        }
        const m = await Module.create({ ...module, courseId })
        return await m.save()
    } catch (e: any) {
        throw new Error(e)
    }
}
