import mongoose from "mongoose";

const Schema = mongoose.Schema

const Module = new Schema({
    name: String,
    type: String,
    content: String,
    courseId: String
}, { timestamps: true })

export default mongoose.model('Module', Module)
