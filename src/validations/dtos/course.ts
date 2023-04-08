import Joi from 'joi'
import ICourse from "../../interfaces/ICourse";

export const courseCreationValidation = (course: ICourse) => {
    const schema = Joi.object({
        title: Joi.string().required().min(5).max(140),
        description: Joi.string().min(15).max(255)
    })

    return schema.validate(course)
}
