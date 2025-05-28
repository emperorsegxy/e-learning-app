import mongoose from "mongoose";

const Schema = mongoose.Schema

const OtpSession = new Schema({
    email: {
        type: String,
        required: true,
    },
    token: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        expires: 60 * 5,
        default: new Date(),
    }
}, { timestamps: true });

export default mongoose.model("OtpSession", OtpSession);