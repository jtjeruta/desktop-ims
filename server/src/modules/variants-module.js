const moment = require('moment')
const { getMongoError } = require('../lib/mongo-errors')
const { VariantModel } = require('../schemas/variant-schema')

module.exports.listVariants = async (query = {}) => {
    try {
        const variants = await VariantModel.find(query)
        return [200, variants]
    } catch (error) {
        console.error('Failed to get variants: ', error)
        return getMongoError(error)
    }
}

module.exports.createVariant = async (data) => {
    const doc = {
        ...data,
        createdAt: moment().unix(),
        modifiedAt: moment().unix(),
    }

    const variant = new VariantModel(doc)

    try {
        const createdVariant = await variant.save()
        return [201, createdVariant]
    } catch (error) {
        console.error('Failed to create variant: ', error)
        return getMongoError(error)
    }
}

module.exports.getVariantById = async (id) => {
    try {
        const variant = await VariantModel.findById(id)

        if (!variant) return [404, { message: 'Variant not found.' }]
        return [200, variant]
    } catch (error) {
        console.error('Failed to get variant by id: ', error)
        return getMongoError(error)
    }
}

module.exports.deleteVariantById = async (id) => {
    try {
        await VariantModel.deleteOne({ _id: id })
        return [200]
    } catch (error) {
        console.error('Failed to delete variant by id: ', error)
        return getMongoError(error)
    }
}

module.exports.deleteVariants = async (query = {}) => {
    try {
        await VariantModel.deleteMany(query)
        return [200]
    } catch (err) {
        console.error('Failed to delete variants: ', error)
        return getMongoError(err)
    }
}
