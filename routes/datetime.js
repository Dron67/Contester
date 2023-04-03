const express = require('express')
const controller = require('../controllers/datetime')
const passport = require('passport')
const router = express.Router()

router.get('/', passport.authenticate('jwt', {session: false}), controller.getDateTime)

module.exports = router