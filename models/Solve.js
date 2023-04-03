const mongoose = require('mongoose')
const Schema = mongoose.Schema

const solveSchema = new Schema({
    task: {
        ref: 'tasks',
        type: Schema.Types.ObjectId
    },
    user: {
        ref: 'users',
        type: Schema.Types.ObjectId
    },
    language: {
        type: String,
        required: true
    },
    result: {
        type: String,
        required: true
    },
    test: {
        type: Number,
        default: ''
    },
    error: {
        type: String,
        default: ''
    },
    date: {
        type: String,
        required: true
    },
    time: {
        type: Number,
        required: true
    },
    memory: {
        type: Number,
        required: true
    },
    code: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('solves', solveSchema)