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

export const verifyEmailValidation = (otpPayload: any) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        otp: Joi.string().required().min(4).max(4),
    })
    return schema.validate(otpPayload)
}

export const resetPasswordValidation = (otpPayload: any) => {
    const schema = Joi.object({
        password: Joi.string().required().min(8),
        sessionToken: Joi.string().required(),
    })
    return schema.validate(otpPayload)
}

