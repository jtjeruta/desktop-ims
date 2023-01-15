const mongoose = require('mongoose')
const defaultSchema = require('./default-schema')

const ProductSchema = new mongoose.Schema({
    ...defaultSchema,
    name: {
        type: String,
        required: true,
    },
    company: {
        type: String,
    },
    category: {
        type: String,
    },
    subCategory: {
        type: String,
    },
    price: {
        type: Number,
        required: true,
        min: [0, 'path price can not be less than 0.'],
    },
    published: {
        type: Boolean,
        required: true,
    },
    sku: {
        type: String,
        required: true,
    },
    stock: {
        type: Number,
        required: true,
    },
    variants: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Variant',
        },
    ],
})

ProductSchema.index({ name: 1 }, { unique: true })
ProductSchema.index({ sku: 1 }, { unique: true })

const ProductModel = mongoose.model('Product', ProductSchema)

module.exports = { ProductModel, ProductSchema }
