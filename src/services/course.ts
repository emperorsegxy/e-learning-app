import Course from "../db/Course";
import ICourse from "../interfaces/ICourse";
import CourseError from "../validations/errors/CourseError";
import {deleteModulesBelongingToCourse} from "./module";

const isCourseOwner = (ownerId: string, confirmingId: string) => ownerId === confirmingId

export const createCourse = async (course: ICourse, ownerId: string) => {
    const title = course.title
    const coursesBelongingToThisOwner = await Course.find({ owner: ownerId }).exec()
    if (coursesBelongingToThisOwner
        .some(_course => _course.title.trim().toLowerCase() === title.trim().toLowerCase())) {
        throw new CourseError('A course with this title already exists', 400)
    }
    const _course = new Course({ ...course, owner: ownerId })
    try {
        return await _course.save()
    } catch (e: any) {
        throw new CourseError('An error occurred trying to create a course')
    }
}


export const updateCourse = async (courseId: string, course: ICourse, ownerId: string) => {
    const existingCourse = await Course.findById(courseId).exec()
    if (!existingCourse) {
        throw new CourseError("There's no course with the provided id", 400)
    }
    if (!isCourseOwner(existingCourse.owner!, ownerId)) {
        throw new CourseError("Course details can only be updated by owner", 403)
    }
    await Course.findByIdAndUpdate(courseId, { title: course.title })
}

export const deleteACourse = async (courseId: string, ownerId: string) => {
    const course = await Course.findById(courseId).exec()
    if (!course) throw new CourseError('There\'s no course with provided id', 400)
    if (!isCourseOwner(course.owner!, ownerId)) throw new CourseError('Course can only be deleted by owner', 403)
    deleteModulesBelongingToCourse(courseId).catch((e: any) => console.error(e))
    await Course.findByIdAndDelete(courseId)
}

export const deleteCourses = async (ownerId: string, coursesIds: string[] = []) => {
    if (!coursesIds || coursesIds.length) {
        const courses = await Course.find({}).exec()
        coursesIds = courses.map(course => course.id)
    }
    for (const coursesId of coursesIds) {
        await deleteACourse(coursesId, ownerId)
    }
}
