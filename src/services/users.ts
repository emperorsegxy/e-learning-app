import User from "../db/User";

export const getAllUsers = async (_id: string) => {
    try {
        return await User.find({id: null}, 'firstName lastName email createdAt').exec()
    } catch (e: any) {
        throw new Error('Something went bad')
    }
}
