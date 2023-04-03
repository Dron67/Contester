const mongoose = require('mongoose')
const Schema = mongoose.Schema

const taskSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    condition: {
        type: String,
        required: true
    },
    competition: {
        ref: 'competitions',
        type: Schema.Types.ObjectId
    },
    limitTime: {
        type: Number,
        required: true
    },
    limitMemory: {
        type: Number,
        required: true
    },
    checker: {
        type: String,
        required: true
    },
    language: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('tasks', taskSchema)