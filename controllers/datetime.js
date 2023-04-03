const errorHandler = require('../utils/ErrorHandler')
const moment = require('moment')
module.exports.getDateTime = function (req, res) {
    try {
        res.status(200).json(moment().format('yyyy-MM-DD HH:mm:ss'))
    } catch (e) {
        errorHandler(res, e)
    }
}