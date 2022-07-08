const moment = require('moment')
const { getMongoError } = require('../lib/mongo-errors')
const { VariantModel } = require('../schemas/variant-schema')

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
        console.error('Failed to create variant')
        return getMongoError(error)
    }
}

module.exports.deleteVariantById = async (id) => {
    try {
        await VariantModel.deleteOne({ _id: id })
        return [200]
    } catch (error) {
        console.error('Failed to delete variant by id')
        return getMongoError(error)
    }
}
