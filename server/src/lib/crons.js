const startBackup = require('./backup-action')
const cron = require('node-cron')

module.exports = () => {
    // schedule a weekly backup at 12:00 PM on Wednesday
    cron.schedule('0 12 * * 3', startBackup)
}
