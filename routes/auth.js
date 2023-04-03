const express = require('express')
const controller = require('../controllers/auth')
const passport = require('passport')
const upload = require('../middleware/upload')
const router = express.Router()

router.post('/login', controller.login)
router.post('/register', controller.register)
router.get('/:id', passport.authenticate('jwt', {session: false}), controller.getById)
router.patch('/:id', passport.authenticate('jwt', {session: false}), upload.single('image'), controller.update)
router.get('/', passport.authenticate('jwt', {session: false}), controller.getAll)
router.delete('/:id', passport.authenticate('jwt', {session: false}), controller.remove)

module.exports = router