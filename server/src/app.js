const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const mongoose = require('mongoose')

const usersAPI = require('./apis/users')
const errorController = require('./lib/error-controller')

const mongoDB =
    process.env.MONGO_CONNECTION_STRING || 'mongodb://desktop-ims-db/ims'

mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })

const app = express()
app.db = mongoose.connection

app.db.on('error', console.error.bind(console, 'MongoDB connection error:'))
app.db.once('open', function () {
    console.log('Connected to DB successfully')
})

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', usersAPI)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404))
})

// error handler
app.use(errorController)

module.exports = app
