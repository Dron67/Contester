const Competition = require('../models/Competition')
const Task = require('../models/Task')
const Test = require('../models/Test')
const Solve = require('../models/Solve')
const errorHandler = require('../utils/ErrorHandler')

module.exports.getAll = async function (req, res) {
    try {
        const competitions = await Competition.find()
        res.status(200).json(competitions)
    } catch (e) {
      errorHandler(res, e)
    }
}

module.exports.getById = async function (req, res) {
    try {
        const competition = await Competition.findOne({_id: req.params.id})
        res.status(200).json(competition)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.remove = async function (req, res) {
    try {
        await Competition.remove({_id: req.params.id})
        const tasks = await Task.find({competition: req.params.id})
        for (let task of tasks){
            await Test.remove({task: task._id})
            await Solve.remove({task: task._id})
        }
        await Task.remove({competition: req.params.id})
        res.status(200).json({
            message: 'Турнир удален.'
        })
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.create = async function (req, res) {
    try {
        console.log(req.body)
        const competition = await new Competition({
            name: req.body.name,
            timeStart: req.body.timeStart,
            timeEnd: req.body.timeEnd
        }).save()
        res.status(201).json(competition)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.update = async function (req, res) {
    try {
        const competition = await Competition.findOneAndUpdate(
            {_id: req.params.id},
            {$set: req.body},
            {new: true})
        res.status(200).json(competition)
    } catch (e) {
        errorHandler(res, e)
    }
}