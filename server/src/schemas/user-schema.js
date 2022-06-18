const mongoose = require('mongoose')
const validator = require('validator')

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        index: true,
        unique: true,
        validate: [validator.isEmail],
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
        enum: ['admin', 'employee'],
    },
})

const UserModel = mongoose.model('User', UserSchema)

UserModel.createIndexes()

module.exports = { UserModel, UserSchema }
