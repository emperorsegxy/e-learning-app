import Course from "../db/Course";
import ICourse from "../interfaces/ICourse";
import CourseError from "../validations/errors/CourseError";

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
    console.log(existingCourse)
    if (!existingCourse) {
        throw new CourseError("There's no course with the provided id", 400)
    }
    if (existingCourse.owner !== ownerId) {
        throw new CourseError("Course details can only be updated by owner")
    }
    console.log(course)
    await Course.findByIdAndUpdate(courseId, { title: course.title })
}
