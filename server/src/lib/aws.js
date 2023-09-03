const AWS = require('aws-sdk')

const AWS_ACCESS_KEY_ID =
    process.env.AWS_ACCESS_KEY_ID || 'AKIAXKBVIUMHVUG4POET'

const AWS_SECRET_ACCESS_KEY =
    process.env.AWS_SECRET_ACCESS_KEY ||
    'lg0GhAIDrGI9VH4mzj1cQhbV3WeeKCOmfWKExNO8'

const AWS_REGION = process.env.AWS_REGION || 'ap-northeast-1'

const s3 = new AWS.S3({
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
    region: AWS_REGION,
})

module.exports.uploadBackupToS3 = async (key, jsonData) => {
    const params = {
        Bucket: 'ims-backups',
        Key: key,
        Body: JSON.stringify(jsonData),
        ContentType: 'application/json',
    }

    return new Promise((resolve) => {
        s3.putObject(params, (err, data) => {
            if (err) resolve([500, err])
            else resolve([200, data])
        })
    })
}
