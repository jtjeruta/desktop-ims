const mongoose = require('mongoose')

const MONGO_CONNECTION_STRING =
    process.env.MONGO_CONNECTION_STRING || 'mongodb://mongo1:30001/ims'

async function dbConnect() {
    await mongoose.connect(MONGO_CONNECTION_STRING, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })

    const db = mongoose.connection

    db.on('error', console.error.bind(console, 'MongoDB connection error:'))
    db.once('open', function () {
        console.info('Connected to DB successfully')
    })

    return db
}

module.exports = { dbConnect }
