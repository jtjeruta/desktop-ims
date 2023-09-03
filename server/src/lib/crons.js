const cron = require('node-cron')
const { backup } = require('../modules/backup-module')

module.exports = () => {
    // Backup database every 2 hours
    cron.schedule('0 */2 * * *', async () => {
        console.info('Backing up database')
        await backup()
        console.info('Database backup completed')
    })
}
