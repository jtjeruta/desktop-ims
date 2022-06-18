const { getMongoError } = require('../lib/mongo-errors')
const { UserModel } = require('../schemas/user-schema')

module.exports.createUser = async (rawUser) => {
    const user = new UserModel(rawUser)

    try {
        const createUser = await user.save()
        return [201, createUser]
    } catch (error) {
        console.error('Failed to create user')
        return getMongoError(error)
    }
}

module.exports.listUsers = async () => {
    try {
        const users = await UserModel.find({})
        return [200, users]
    } catch (error) {
        console.error('Failed to list users')
        console.error(error)
        return getMongoError(error)
    }
}
