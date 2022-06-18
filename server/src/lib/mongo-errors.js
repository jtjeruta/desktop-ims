module.exports.getMongoError = (error) => {
    if ((error.message || '').includes('validation failed')) {
        return [400, { message: error.message, errors: error.errors }]
    }

    if (error.code === 11000) {
        return [409, { message: 'Duplicate found.' }]
    }

    return [500, { message: 'Something went wrong.' }]
}
