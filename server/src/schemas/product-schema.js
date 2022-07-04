const mongoose = require('mongoose')
const defaultSchema = require('./default-schema')

const ProductSchema = new mongoose.Schema({
    ...defaultSchema,
    name: {
        type: String,
        required: true,
        index: true,
        unique: true,
    },
    brand: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    subCategory: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
        min: [0, 'path price can not be less than 0.'],
    },
    aveUnitCost: {
        type: Number,
        min: [0, 'path aveUnitCost can not be less than 0.'],
    },
    published: {
        type: Boolean,
        required: true,
    },
})

const ProductModel = mongoose.model('Product', ProductSchema)

ProductModel.createIndexes()

module.exports = { ProductModel, ProductSchema }
