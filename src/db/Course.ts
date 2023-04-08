import mongoose from 'mongoose'

const Schema = mongoose.Schema

const Course = new Schema({
    title: {
        type: String,
        required: true
    },
    owner: String,
    description: {
        type: String
    }
}, { timestamps: true })

export default mongoose.model('Course', Course)
