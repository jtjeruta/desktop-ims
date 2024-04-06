const { getMongoError } = require('../lib/mongo-errors')
const bcrypt = require('bcrypt')
const { UserModel } = require('../schemas/user-schema')

module.exports.createUser = async ({ password, ...rawUser }) => {
    const encryptedPassword = await bcrypt.hash(password || '', 10)
    const user = new UserModel({ ...rawUser, password: encryptedPassword })

    try {
        const createUser = await user.save()
        return [201, createUser]
    } catch (error) {
        console.error('Failed to create user: ', error)
        return getMongoError(error)
    }
}

module.exports.listUsers = async (query = {}) => {
    try {
        const users = await UserModel.find(query)
        return [200, users]
    } catch (error) {
        console.error('Failed to list users: ', error)
        return getMongoError(error)
    }
}

module.exports.getUserById = async (id) => {
    try {
        const user = await UserModel.findById(id)

        if (!user) {
            return [404, { message: 'Not found.' }]
        }

        return [200, user]
    } catch (error) {
        console.error('Failed to find user by id: ', error)
        return getMongoError(error)
    }
}

module.exports.getUser = async (query = {}) => {
    try {
        const user = await UserModel.findOne(query)

        if (!user) {
            return [404, { message: 'Not found.' }]
        }

        return [200, user]
    } catch (error) {
        console.error('Failed to find user by email: ', error)
        return getMongoError(error)
    }
}

module.exports.deleteUser = async (query) => {
    try {
        await UserModel.deleteOne(query)
        return [200]
    } catch (error) {
        console.error('Failed to delete user: ', error)
        return getMongoError(error)
    }
}

module.exports.updateUser = async (id, data) => {
    try {
        const updateUser = await UserModel.findByIdAndUpdate(
            { _id: id },
            { $set: data },
            { new: true, runValidators: true }
        )
        return [200, updateUser]
    } catch (error) {
        console.error('Failed to update user: ', error)
        return getMongoError(error)
    }
}
