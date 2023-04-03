const childProcess = require('child_process')
const errorHandler = require("../utils/ErrorHandler");
const Setting = require('../models/Settings')

module.exports.language = async function (req, res) {
    try {
        const settings = await Setting.find()
        res.status(200).json(settings)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.update = async function (req, res) {
    try {
        const setting = await Setting.findOneAndUpdate(
            {_id: req.params.id},
            {$set: req.body},
            {new: true}
        )
        res.status(200).json(setting)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.remove = async function (req, res) {
    try {
        await Setting.remove({_id: req.params.id})
        res.status(200).json({
            message: 'Компилятор удален'
        })
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.getById = async function (req, res) {
    try {
        const setting = await Setting.findOne({_id: req.params.id})
        res.status(200).json(setting)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.create = async function (req, res) {
    try {
        const setting = await new Setting({
            name: req.body.name,
            file: req.body.file,
            commander: req.body.commander
        }).save()
        res.status(201).json(setting)
    } catch (e) {
        errorHandler(res, e)
    }
}