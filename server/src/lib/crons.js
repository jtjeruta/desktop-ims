const startBackup = require('./backup-action')
const cron = require('node-cron')

module.exports = () => {
    cron.schedule('0 12 * * *', startBackup)
}
