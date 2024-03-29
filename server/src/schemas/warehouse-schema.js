const mongoose = require('mongoose')
const defaultSchema = require('./default-schema')

const WarehouseSchema = new mongoose.Schema({
    ...defaultSchema,
    name: {
        type: String,
        required: true,
    },
    products: [
        {
            source: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true,
            },
            stock: {
                type: Number,
                required: true,
            },
        },
    ],
})

WarehouseSchema.index({ name: 1 }, { unique: true })

const WarehouseModel = mongoose.model('Warehouse', WarehouseSchema)

module.exports = { WarehouseModel, WarehouseSchema }
