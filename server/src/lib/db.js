const mongoose = require('mongoose')

const MONGO_CONNECTION_STRING =
    process.env.MONGO_CONNECTION_STRING || 'mongodb://desktop-ims-db/ims'

function dbConnect() {
    mongoose.connect(MONGO_CONNECTION_STRING, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })

    const db = mongoose.connection

    db.on('error', console.error.bind(console, 'MongoDB connection error:'))
    db.once('open', function () {
        console.log('Connected to DB successfully')
    })

    return db
}

module.exports = { dbConnect }
