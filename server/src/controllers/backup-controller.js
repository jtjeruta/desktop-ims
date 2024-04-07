const backupModule = require('../modules/backup-module')

module.exports.listBackups = async (req, res) => {
    const [status, data] = await backupModule.listBackups()
    return res.status(status).json(data)
}

module.exports.backupDB = async (req, res) => {
    const [status, data] = await backupModule.backup()
    return res.status(status).json(data)
}

module.exports.restoreDB = async (req, res) => {
    const [status, data] = await backupModule.restore(req.body.key)
    return res.status(status).json(data)
}
