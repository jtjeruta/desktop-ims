const moment = require('moment')
const crypto = require('crypto')
const { getMongoError } = require('../lib/mongo-errors')
const { ProductModel } = require('../schemas/product-schema')

module.exports.createProduct = async (data) => {
    const doc = {
        ...data,
        createdAt: moment().unix(),
        modifiedAt: moment().unix(),
    }

    const product = new ProductModel(doc)

    try {
        const createdProduct = await product.save()
        return [201, createdProduct]
    } catch (error) {
        console.error('Failed to create product')
        return getMongoError(error)
    }
}

module.exports.listProducts = async () => {
    try {
        const products = await ProductModel.find({})
        return [200, products]
    } catch (error) {
        console.error('Failed to list products')
        return getMongoError(error)
    }
}

module.exports.getProductById = async (id) => {
    try {
        const product = await ProductModel.findById(id).populate('variants')

        if (!product) {
            return [404, { message: 'Not found.' }]
        }

        return [200, product]
    } catch (error) {
        console.error(error)
        console.error('Failed to find product by id')
        return getMongoError(error)
    }
}

module.exports.updateProduct = async (id, data) => {
    const doc = {
        ...data,
        modifiedAt: moment().unix(),
    }

    try {
        const updatedProduct = await ProductModel.findByIdAndUpdate(
            { _id: id },
            { $set: doc },
            { new: true, runValidators: true }
        )
        return [200, updatedProduct]
    } catch (error) {
        console.error('Failed to update product')
        return getMongoError(error)
    }
}

module.exports.generateSKU = () => {
    return crypto.randomBytes(4).toString('hex').toUpperCase()
}
