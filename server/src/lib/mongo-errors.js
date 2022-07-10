module.exports.getMongoError = (error) => {
    if (
        ['validation failed', 'Validation failed'].some((message) =>
            (error.message || '').includes(message)
        )
    ) {
        return [400, { message: error.message, errors: error.errors }]
    }

    if (error.message.includes('Cast to ObjectId failed for value')) {
        return [404, { message: 'Not found.' }]
    }

    if (error.code === 11000) {
        return [409, { message: 'Duplicate found.' }]
    }

    return [500, { message: 'Something went wrong.' }]
}
