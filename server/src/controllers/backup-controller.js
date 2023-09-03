const backup = require('../lib/backup')

module.exports.backup = async (req, res) => {
    const [status, data] = await backup()
    return res.status(status).json(data)
}
