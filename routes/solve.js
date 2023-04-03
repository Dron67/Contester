const express = require('express')
const controller = require('../controllers/solve')
const passport = require('passport')
const router = express.Router()

router.post('/', passport.authenticate('jwt', {session: false}), controller.create)
router.get('/:taskId/:userId', passport.authenticate('jwt', {session: false}), controller.getByTaskIdAndUserId)
router.delete('/:id', passport.authenticate('jwt', {session: false}), controller.remove)
router.post('/accept', passport.authenticate('jwt', {session: false}), controller.getByTaskAndChecking)
router.get('/:userId', passport.authenticate('jwt', {session: false}), controller.getByUserId)

module.exports = router