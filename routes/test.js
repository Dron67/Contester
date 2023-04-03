const express = require('express')
const controller = require('../controllers/test')
const passport = require('passport')
const router = express.Router()

router.get('/:id', passport.authenticate('jwt', {session: false}), controller.getByTaskId)
router.post('/', passport.authenticate('jwt', {session: false}), controller.create)
router.delete('/:id', passport.authenticate('jwt', {session: false}), controller.remove)
router.patch('/:id', passport.authenticate('jwt', {session: false}), controller.update)

module.exports = router