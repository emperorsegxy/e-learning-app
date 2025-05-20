import mongoose from "mongoose";
import dotenv from 'dotenv'
import Logger, {LoggerLevel} from "../utils/logger";

dotenv.config()

console.log(process.env)

const CONNECT_URI = process.env.MONGO_URI as string

console.log(CONNECT_URI, 'connecting to mongodb')

export default async () => await mongoose.connect(CONNECT_URI)

const LoggerMeta = { label: 'database connection' }
export const databaseLogger = (message: string, level: LoggerLevel = 'debug') => Logger[level](message, LoggerMeta)
