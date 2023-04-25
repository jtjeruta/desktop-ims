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

module.exports.listProducts = async (query = {}) => {
    try {
        const products = await ProductModel.find(query).populate('variants')
        return [200, products]
    } catch (error) {
        console.error('Failed to list products')
        return getMongoError(error)
    }
}

module.exports.getProductById = async (id, session = null) => {
    try {
        const product = await ProductModel.findById(id)
            .populate('variants')
            .session(session)

        if (!product) {
            return [404, { message: 'Product not found.' }]
        }

        return [200, product]
    } catch (error) {
        console.error('Failed to find product by id')
        return getMongoError(error)
    }
}

module.exports.getProduct = async (query, session = null) => {
    try {
        const product = await ProductModel.findOne(query)
            .populate('variants')
            .session(session)

        if (!product) {
            return [404, { message: 'Product not found.' }]
        }

        return [200, product]
    } catch (error) {
        console.error('Failed to find product')
        return getMongoError(error)
    }
}

module.exports.updateProduct = async (id, data, session = null) => {
    const doc = {
        ...data,
        modifiedAt: moment().unix(),
    }

    try {
        const updatedProduct = await ProductModel.findByIdAndUpdate(
            { _id: id },
            { $set: doc },
            { new: true, runValidators: true, session }
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

module.exports.deleteProducts = async (query = {}) => {
    try {
        await ProductModel.deleteMany(query)
        return [200]
    } catch (err) {
        console.error('Failed to delete products')
        return getMongoError(err)
    }
}
