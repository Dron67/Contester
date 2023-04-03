const express = require('express')
const controller = require('../controllers/settings')
const passport = require('passport')
const router = express.Router()

router.get('/', passport.authenticate('jwt', {session: false}), controller.language)
router.get('/:id', passport.authenticate('jwt', {session: false}), controller.getById)
router.post('/', passport.authenticate('jwt', {session: false}), controller.create)
router.delete('/:id', passport.authenticate('jwt', {session: false}), controller.remove)
router.patch('/:id', passport.authenticate('jwt', {session: false}), controller.update)

module.exports = router