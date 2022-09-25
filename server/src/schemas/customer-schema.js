const mongoose = require('mongoose')
const defaultSchema = require('./default-schema')

const CustomerSchema = new mongoose.Schema({
    ...defaultSchema,
    name: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
    },
    email: {
        type: String,
    },
    address: {
        type: String,
    },
})

CustomerSchema.index({ name: 1 }, { unique: true })

const CustomerModel = mongoose.model('Customer', CustomerSchema)

module.exports = { CustomerModel, CustomerSchema }
