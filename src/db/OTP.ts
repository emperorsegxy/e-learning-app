import mongoose from "mongoose";

const Schema = mongoose.Schema

const otp = new Schema({
    email: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        expires: 60 * 5,
        default: new Date(),
    }
})

export default mongoose.model('OTP', otp)