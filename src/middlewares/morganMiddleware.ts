import morgan, { StreamOptions } from "morgan";
import Logger from "../utils/logger";

const stream: StreamOptions = {
    write: (message: string)=> Logger.http(message)
}

export default morgan(":method :url :status content-length - :res[content-length] - :response-time ms", { stream })
