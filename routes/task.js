const express = require('express')
const controller = require('../controllers/task')
const passport = require('passport')
const router = express.Router()

router.get('/competition/:id', passport.authenticate('jwt', {session: false}), controller.getById)
router.get('/:competitionId', passport.authenticate('jwt', {session: false}), controller.getByCompetitionId)
router.delete('/:id', passport.authenticate('jwt', {session: false}), controller.remove)
router.post('/', passport.authenticate('jwt', {session: false}), controller.create)
router.patch('/:id', passport.authenticate('jwt', {session: false}), controller.update)
router.get('/', passport.authenticate('jwt', {session: false}), controller.fetch)

module.exports = router