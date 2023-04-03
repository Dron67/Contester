const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const passport = require('passport')

const authRoutes = require('./routes/auth')
const competitionRoutes = require('./routes/competition')
const taskRoutes = require('./routes/task')
const solveRoutes = require('./routes/solve')
const settingRoutes = require('./routes/settings')
const testRoutes = require('./routes/test')
const datetimeRoutes = require('./routes/datetime')
const tableRoutes = require('./routes/table')
const keys = require('./config/keys')

const app = express()

mongoose.connect(keys.mongoURI, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
    .then(() => console.log('MongoDB connected'))
    .catch(error => console.log(error))

app.use(passport.initialize())
require('./middleware/passport')(passport)

app.use(require('morgan')('dev'))
app.use('/uploads', express.static('uploads'))
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(require('cors')())

app.use('/api/auth', authRoutes)
app.use('/api/competition', competitionRoutes)
app.use('/api/task', taskRoutes)
app.use('/api/solve', solveRoutes)
app.use('/api/setting', settingRoutes)
app.use('/api/test', testRoutes)
app.use('/api/datetime', datetimeRoutes)
app.use('/api/table', tableRoutes)

module.exports = app