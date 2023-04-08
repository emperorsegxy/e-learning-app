import mongoose from "mongoose";
import dotenv from 'dotenv'

dotenv.config()

const CONNECT_URI = process.env.MONGO_URI as string
console.log(CONNECT_URI)
const connectDB = () => mongoose.connect(CONNECT_URI).then(r => console.log('db connected...'))

export default connectDB