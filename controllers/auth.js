const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const Solve = require('../models/Solve')
const keys = require('../config/keys')
const errorHandler = require('../utils/ErrorHandler')

module.exports.getAll = async function (req, res) {
    try {
        const users = await User.find()
        res.status(200).json(users)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.getById = async function (req, res) {
    try{
        const user = await User.findOne({_id: req.params.id})
        res.status(200).json(user)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.update = async function (req, res) {
    const salt = bcrypt.genSaltSync(10)
    const password = req.body.password
    console.log(password);
    const updated = {
        login: req.body.login,
        lastName: req.body.lastName,
        firstName: req.body.firstName,
        secondName: req.body.secondName,
        organization: req.body.organization,
        role: req.body.role
    }
    if (req.file) {
        updated.imageSrc = req.file.path
    } else {
        updated.imageSrc = 'png-transparent-user-profile-computer-icons-login-user-avatars-thumbnail.png'
    }
    if (password !== ''){
        console.log('хеширование')
        updated.password = bcrypt.hashSync(password,salt);
    }
    try {
        const user = await User.findOneAndUpdate(
            {_id: req.params.id},
            {$set: updated},
            {new: true})
        res.status(200).json(user)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.login = async function (req,res){
    const candidate = await User.findOne({login: req.body.login})
    if(candidate){
        const passwordResult = bcrypt.compareSync(req.body.password, candidate.password)
        if(passwordResult){
            // Генерация токена, пароли совпали
            const token = jwt.sign({
                login: candidate.login,
                userId: candidate._id
            }, keys.jwt,{expiresIn: 60*60*8})
            res.status(200).json({
                token: `Bearer ${token}`,
                userId: candidate._id
            })
        }else {
            res.status(401).json({
                message: 'Пароли не совпадают. Попробуйте снова.'
            }) //401 - unauthorized
        }
    } else{
        // Error
        res.status(404).json({
            message: 'Пользователь с таким Логином не найден'
        }) // 404 - Not Found
    }
}

module.exports.register = async function (req,res){
    // login password
    const candidate = await User.findOne({login: req.body.login})

    if(candidate){
        res.status(409).json({ //490 - конфликт
            message: 'Такой Логин уже занят. Попробуйте другой.'
        })
    } else {
        const salt = bcrypt.genSaltSync(10)
        const password = req.body.password
        const user = new User({
            login: req.body.login,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            secondName: req.body.secondName,
            organization: req.body.organization,
            password: bcrypt.hashSync(password,salt),
            role: false
        })

        try{
            await user.save()
            res.status(201).json(user) //201 - success
        } catch (e){
            // Обработка ошибки
            errorHandler(res, e)
        }


    }
}

module.exports.remove = async function (req, res) {
    try {
        await User.remove({_id: req.params.id})
        await Solve.remove({user: req.params.id})
        res.status(200).json({
            message: 'Пользователь удален.'
        })
    } catch (e) {
        errorHandler(res, e)
    }
}