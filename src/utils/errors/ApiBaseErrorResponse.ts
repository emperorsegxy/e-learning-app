export default <T extends Error>(statusCode: number, error: T) => {
    console.log(statusCode, error);
    return {
        statusCode,
        message: error.message,
        success: false
    }
}