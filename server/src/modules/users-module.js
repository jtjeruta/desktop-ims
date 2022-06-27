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
        return getMongoError(error)
    }
}

module.exports.getUserById = async (id) => {
    try {
        const user = await UserModel.findById(id)
        return [200, user]
    } catch (error) {
        console.error('Failed to find user by id')
        return getMongoError(error)
    }
}

module.exports.getUserByEmail = async (email) => {
    try {
        const user = await UserModel.findOne({ email })
        return [200, user]
    } catch (error) {
        console.error('Failed to find user by email')
        return getMongoError(error)
    }
}

// For testing only
module.exports.deleteUserById = async (id) => {
    try {
        await UserModel.deleteOne({ _id: id })
        return [200]
    } catch (error) {
        console.error('Failed to delete user by id')
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
        console.error('Failed to update user')
        return getMongoError(error)
    }
}
