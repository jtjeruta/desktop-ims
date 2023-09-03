const cron = require('node-cron')
const { backup } = require('../modules/backup-module')

module.exports = () => {
    // Backup database everyday at 12:00 PM
    cron.schedule('0 12 * * *', async () => {
        console.info('Backing up database')
        await backup()
        console.info('Database backup completed')
    })
}
