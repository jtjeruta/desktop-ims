const mongoose = require('mongoose')
const defaultSchema = require('./default-schema')

const VariantSchema = new mongoose.Schema({
    ...defaultSchema,
    name: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: [0, 'Path `quantity` can not be less than 0.'],
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
})

VariantSchema.index({ name: 1, product: 1 }, { unique: true })

const VariantModel = mongoose.model('Variant', VariantSchema)

module.exports = { VariantModel, VariantSchema }
