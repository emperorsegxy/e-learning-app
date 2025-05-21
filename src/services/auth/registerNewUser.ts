import User from "../../db/User";
import bcryptjs from 'bcryptjs'
import IUserRegisterPayload, {UserType} from "../../interfaces/IUserRegisterPayload";
import {sendOTP} from "./manageOTP";

const isEmailAvailable = async (email: string) => !await User.findOne({email}).exec()

const securePassword = async (password: string) => {
    const salt = await bcryptjs.genSalt(10)
    return await bcryptjs.hash(password, salt)
}

const validateUserType = (userType: UserType) => ['creator', 'learner'].includes(userType)

const registerNewUser = async (user: IUserRegisterPayload) => {
    if (await isEmailAvailable(user.email)) {
        user.password = await securePassword(user.password)
        const _user = new User(user)
        try {
            await _user.save()
            const {otp} = await sendOTP(user)
            return otp
        } catch (e: any) {
            throw e
        }
    } else {
        throw new Error('User already exists')
    }
}

export default registerNewUser
