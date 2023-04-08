
interface JoiError {
    details: ({
       message: string,
    })[]
}
export default function getErrorMsg(error: JoiError) {
    return error.details[0].message
}