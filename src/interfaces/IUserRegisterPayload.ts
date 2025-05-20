export default interface IUserRegisterPayload {
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    userType: UserType,
}

export type UserType = "creator" | "learner"