const mongoose = require('mongoose')
const Schema = mongoose.Schema

const settingSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    file: {
        type: String,
        required: true
    },
    commander: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('settings', settingSchema)