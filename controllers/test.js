const Test = require('../models/Test')
const errorHandler = require('../utils/ErrorHandler')

module.exports.getByTaskId = async function (req, res) {
    try {
        const tests = await Test.find({task: req.params.id})
        res.status(200).json(tests)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.create = async function (req, res) {
    try {
        const test = await new Test({
            input: req.body.input,
            pattern: req.body.pattern,
            task: req.body.task
        }).save()
        res.status(201).json(test)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.remove = async function (req, res) {
    try {
        await Test.remove({_id: req.params.id})
        res.status(200).json({
            message: 'Тестовая пара удалена'
        })
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.update = async function (req, res) {
    try {
        const test = await Test.findOneAndUpdate(
            {_id: req.params.id},
            {$set: req.body},
            {new: true}
        )
        res.status(200).json(test)
    } catch (e) {
        errorHandler(res, e)
    }
}