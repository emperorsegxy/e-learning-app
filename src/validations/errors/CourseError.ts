export default class CourseError extends Error {
    status: number = 500
    name = 'CourseError'
    constructor(message: string, status?: number) {
        super(message);
        if (status) {
            this.status = status
        }
    }
}
