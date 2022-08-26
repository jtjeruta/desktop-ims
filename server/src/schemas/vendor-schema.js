const mongoose = require('mongoose')
const defaultSchema = require('./default-schema')

const VendorSchema = new mongoose.Schema({
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

VendorSchema.index({ name: 1 }, { unique: true })

const VendorModel = mongoose.model('Vendor', VendorSchema)

module.exports = { VendorModel, VendorSchema }
