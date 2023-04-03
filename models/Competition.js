const mongoose = require('mongoose')
const Schema = mongoose.Schema

const competitionSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    timeStart: {
        type: String,
        required: true
    },
    timeEnd: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('competitions', competitionSchema)