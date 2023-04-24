import mongoose from "mongoose";

const Schema = mongoose.Schema

const Module = new Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    courseId: {
        type: String,
        required: true
    },
    contentType: {
        type: String,
        required: true
    }
}, { timestamps: true })

export default mongoose.model('Module', Module)
