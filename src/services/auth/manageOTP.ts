import User from "../../db/User";
import otpGenerator from "otp-generator";
import OTP from "../../db/OTP";

export const sendOTP = async ({ email }: { email: string }) => {
    const isUserExisting = await User.findOne({ email: email })
    if (isUserExisting) {
        let otp = await (otpGenerator as any).generate(4, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        })
        let otpExists = await OTP.findOne({otp})
        while (otpExists) {
            // @ts-ignore
            otp = await otpGenerator.generate(4, {
                upperCaseAlphabets: false,
            })
            otpExists = await OTP.findOne({otp})
        }
        const otpPayload = { email, otp }
        await OTP.create(otpPayload)
        return otpPayload
    } else {
        throw new Error("User not found")
    }
}

export const verifyOTP = async ({ email, otp }: { email: string ; otp: string }) => {
    const otpExists = await OTP.findOne({ email }).sort({ createdAt: -1 }).limit(1)
    if (otpExists) {
        if (otpExists.otp === otp)
            await User.updateOne({ email }, { hasVerifiedEmail: true})
        else throw Error('OTP verification failed')
    } else throw Error('OTP verification failed')
}