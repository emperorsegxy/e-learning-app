import User from "../../db/User";
import IUserRegisterPayload from "../../interfaces/IUserRegisterPayload";
import {sendOTP} from "./manageOTP";
import {sendOtpEmail} from "./mailService";
import {securePassword} from "../../utils/bcryptor";

const isEmailAvailable = async (email: string) => !await User.findOne({email}).exec()


// const validateUserType = (userType: UserType) => ['creator', 'learner'].includes(userType)

const registerNewUser = async (user: IUserRegisterPayload) => {
    if (await isEmailAvailable(user.email)) {
        user.password = await securePassword(user.password)
        const _user = new User(user)
        try {
            await _user.save()
            const {otp} = await sendOTP(user)
            const sentMailResult = sendOtpEmail({to:user.email, otp, user})
            console.log(sentMailResult)
            return { message: 'User registered, OTP sent', data: otp };
        } catch (e: any) {
            throw e
        }
    } else {
        throw new Error('User already exists')
    }
}

export default registerNewUser
