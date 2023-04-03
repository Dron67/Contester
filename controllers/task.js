const Task = require('../models/Task')
const Test = require('../models/Test')
const Solve = require('../models/Solve')
const errorHandler = require('../utils/ErrorHandler')

module.exports.getByCompetitionId = async function (req, res) {
    try {
        const tasks = await Task.find({competition: req.params.competitionId})
        res.status(200).json(tasks)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.getById = async function (req, res) {
    try {
        const task = await Task.findOne({_id: req.params.id})
        res.status(200).json(task)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.fetch = async function (req, res) {
    try {
        const tasks = await Task.find()
        res.status(200).json(tasks)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.remove = async function (req, res) {
    try {
        await Task.remove({_id: req.params.id})
        await Test.remove({task: req.params.id})
        await Solve.remove({task: req.params.id})
        res.status(200).json({
            message: 'Задача удалена.'
        })
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.create = async function (req, res) {
    try {
        const task = await new Task({
            name: req.body.name,
            condition: req.body.condition,
            competition: req.body.competition,
            limitTime: req.body.limitTime,
            limitMemory: req.body.limitMemory,
            checker: req.body.checker,
            language: req.body.language
        }).save()
        res.status(201).json(task)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.update = async function (req, res) {
    try {
        const task = await Task.findOneAndUpdate(
            {_id: req.params.id},
            {$set: req.body},
            {new: true})
        res.status(200).json(task)
    } catch (e) {
        errorHandler(res, e)
    }
}