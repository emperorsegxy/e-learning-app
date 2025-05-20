import Joi from "joi";
import LoginPayload from "../../interfaces/LoginPayload";

export const registerValidation = (user: any) => {
    const schema = Joi.object({
        firstName: Joi.string().required().min(3),
        lastName: Joi.string().required().min(3),
        email: Joi.string().email().required(),
        userType: Joi.string().required(),
        password: Joi.string().required().min(8)
    })
    return schema.validate(user)
}

export const loginValidation = (user: LoginPayload) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required().min(8)
    })
    return schema.validate(user)
}