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
    sellingPrice: {
        type: Number,
        required: true,
        min: [0, 'path selling price can not be less than 0.'],
    },
    costPrice: {
        type: Number,
        required: true,
        min: [0, 'path cost price can not be less than 0.'],
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
    reorderPoint: {
        type: Number,
        required: true,
        min: [0, 'path reorder point can not be less than 0.'],
    },
    archived: {
        type: Boolean,
        default: false,
    },
})

const ProductModel = mongoose.model('Product', ProductSchema)

module.exports = { ProductModel, ProductSchema }
