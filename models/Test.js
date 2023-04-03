const mongoose = require('mongoose')
const Schema = mongoose.Schema

const testSchema = new Schema({
    input: {
        type: String,
        required: true
    },
    pattern: {
        type: String,
        default: ''
    },
    task: {
        ref: 'tasks',
        type: Schema.Types.ObjectId
    }
})

module.exports = mongoose.model('tests', testSchema)