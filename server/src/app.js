const express = require('express')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const mongoose = require('mongoose')

const Routes = require('./routes')

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

app.use('/', Routes)

app.use(function (req, res) {
    return res.status(404).json({ message: 'Route does not exist.' })
})

module.exports = app
