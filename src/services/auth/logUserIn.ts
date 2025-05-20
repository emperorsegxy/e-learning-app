import User from "../../db/User";
import bcryptjs from "bcryptjs";
import jwt from 'jsonwebtoken'
import LoginPayload from "../../interfaces/LoginPayload";

const isSamePasswordCorrect = async (password: string, savePassword: string) => {
    return await bcryptjs.compare(password, savePassword)
}

const logUserIn = async (user: LoginPayload) => {
    const _user = await User.findOne({ email: user.email }).exec()
    if (!_user) throw new Error("User does not exist")
    if (!await isSamePasswordCorrect(user.password, _user?.password!)) throw new Error("Combination is bad")
    try {
        const userData = {
            id: _user._id!,
            email: user.email,
            userType: _user?.userType,
        }
        const token = jwt.sign(userData, process.env.JWT_TOKEN_KEY as string, { algorithm: 'HS256' })
        return {
            token,
            ...userData,
        }
    } catch (e: any) {
        throw new Error(e)
    }
}

export default logUserIn
