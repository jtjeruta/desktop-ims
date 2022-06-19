const express = require('express')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const cors = require('cors')

const Routes = require('./routes')
const { dbConnect } = require('./lib/db')

const app = express()
app.db = dbConnect()

app.use(logger('dev'))
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

app.use('/', Routes)

app.use(function (req, res) {
    return res.status(404).json({ message: 'Route does not exist.' })
})

module.exports = app
