const mongoose = require('mongoose')
const backupModule = require('../modules/backup-module')

const db = mongoose.connection

module.exports.healthCheck = async (req, res) => {
    if (db.readyState !== 1) return res.status(500).send('DB not connected')
    return res.status(200).send('OK')
}

module.exports.backupDB = async (req, res) => {
    const [status, data] = await backupModule.backup()
    return res.status(status).json(data)
}

module.exports.restoreDB = async (req, res) => {
    const [status, data] = await backupModule.restore(req.query.key)
    return res.status(status).json(data)
}

module.exports.listBackups = async (req, res) => {
    const [status, data] = await backupModule.listBackups()
    return res.status(status).json(data)
}
