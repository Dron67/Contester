const express = require('express')
const controller = require('../controllers/table')
const passport = require('passport')
const router = express.Router()

router.get('/:id', passport.authenticate('jwt', {session: false}), controller.fetchTable)

module.exports = router