import mongoose from "mongoose";

const Schema = mongoose.Schema

const User = new Schema({
    firstName: String,
    lastName: String,
    email: String,
    hasVerifiedEmail: Boolean,
    password: String,
    userType: {
        type: String,
        required: true,
    },
}, { timestamps: true })
export default mongoose.model('User', User)