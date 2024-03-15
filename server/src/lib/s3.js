const AWS = require('aws-sdk')

const AWS_ACCESS_KEY_ID =
    process.env.AWS_ACCESS_KEY_ID || 'AKIAXKBVIUMHZQI3MYM5'

const AWS_SECRET_ACCESS_KEY =
    process.env.AWS_SECRET_ACCESS_KEY ||
    'uOZU7UmILLRBeYvCFvjo4ns2bdb1ep98usaIFKlj'

const AWS_REGION = process.env.AWS_REGION || 'ap-northeast-1'

const s3 = new AWS.S3({
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
    region: AWS_REGION,
})

module.exports.uploadJSONToS3 = async (bucket, key, jsonData) => {
    const params = {
        Bucket: bucket,
        Key: key,
        Body: JSON.stringify(jsonData),
        ContentType: 'application/json',
    }

    return new Promise((resolve) => {
        s3.putObject(params, (err, data) => {
            if (err) resolve([err.statusCode ?? 500, err])
            else resolve([200, data])
        })
    })
}

module.exports.listBucketObjects = async (bucket, prefix = '') => {
    const params = {
        Bucket: bucket,
        Prefix: prefix,
    }

    return new Promise((resolve) => {
        s3.listObjects(params, (err, data) => {
            if (err) resolve([err.statusCode ?? 500, err])
            else resolve([200, data.Contents])
        })
    })
}

module.exports.getObject = async (bucket, key) => {
    const params = {
        Bucket: bucket,
        Key: key,
    }

    let jsonData = ''

    return new Promise((resolve) => {
        s3.getObject(params)
            .createReadStream()
            .on('data', async (stream) => {
                jsonData += stream.toString()
            })
            .on('end', () => {
                try {
                    const data = JSON.parse(jsonData)
                    return resolve([200, data])
                } catch (err) {
                    return resolve([500, { message: 'Error parsing S3 JSON' }])
                }
            })
            .on('error', (err) => resolve([err.statusCode ?? 500, err]))
    })
}
