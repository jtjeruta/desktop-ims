const mongoose = require('mongoose')
const validator = require('validator')

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
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

UserSchema.index({ email: 1 }, { unique: true })
const UserModel = mongoose.model('User', UserSchema)

module.exports = { UserModel, UserSchema }
