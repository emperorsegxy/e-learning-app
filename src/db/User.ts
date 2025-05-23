import mongoose from "mongoose";

const Schema = mongoose.Schema

const User = new Schema({
    firstName: String,
    lastName: String,
    email: {
        type: String,
        unique: true,
    },
    hasVerifiedEmail: {
        default: false,
        type: Boolean
    },
    password: String,
    userType: {
        type: String,
        required: true,
        enum: ['learner', 'creator'],
    }
}, { timestamps: true })
export default mongoose.model('User', User)