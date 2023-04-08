import User from "../../db/User";
import bcryptjs from 'bcryptjs'

const isEmailAvailable = async (email: string) => !await User.findOne({email}).exec()

const securePassword = async (password: string) => {
    const salt = await bcryptjs.genSalt(10)
    return await bcryptjs.hash(password, salt)
}

const registerNewUser = async (user: any) => {
    if (await isEmailAvailable(user.email)) {
        user.password = await securePassword(user.password)
        console.log(user.password)
        const _user = new User(user)
        try {
            await _user.save()
        } catch (e: any) {
            console.log(e)
            throw e
        }
    } else {
        throw new Error('User already exists')
    }
}

export default registerNewUser