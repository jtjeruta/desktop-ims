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
        required: true,
    },
    email: {
        type: String,
    },
    address: {
        type: String,
        required: true,
    },
})

VendorSchema.index({ name: 1 }, { unique: true })
VendorSchema.index({ phone: 1 }, { unique: true })

const VendorModel = mongoose.model('Vendor', VendorSchema)

module.exports = { VendorModel, VendorSchema }
