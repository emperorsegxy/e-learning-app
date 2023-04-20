import mongoose from "mongoose";
import dotenv from 'dotenv'

dotenv.config()

const CONNECT_URI = process.env.MONGO_URI as string
let connectDB: () => Promise<typeof mongoose>
try {
    connectDB = async () => await mongoose.connect(CONNECT_URI)
} catch (e: any) {
    console.error(e.message)
    process.exit()
}

export default connectDB
