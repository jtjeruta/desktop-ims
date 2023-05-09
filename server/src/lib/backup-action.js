const AdmZip = require('adm-zip')
const moment = require('moment')

module.exports = () => {
    try {
        console.info('Starting backup process...')
        const date = moment().format('YYYY-MM-DD HH:mm:ss')
        const zip = new AdmZip()
        zip.addLocalFolder('/opt/data')
        zip.writeZip(`/opt/backups/backup-${date}.zip`)
        console.info('Backup process finished')
    } catch (error) {
        console.error('Backup process failed: ', error)
    }
}
