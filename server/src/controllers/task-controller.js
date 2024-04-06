const mongoose = require('mongoose')

const db = mongoose.connection

module.exports.healthCheck = async (req, res) => {
    if (db.readyState !== 1) return res.status(500).send('DB not connected')
    return res.status(200).send('OK')
}
