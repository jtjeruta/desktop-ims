const moment = require('moment')
const { getMongoError } = require('../lib/mongo-errors')
const { WarehouseModel } = require('../schemas/warehouse-schema')

module.exports.createWarehouse = async (data) => {
    const doc = {
        ...data,
        createdAt: moment().unix(),
        modifiedAt: moment().unix(),
    }

    const warehouse = new WarehouseModel(doc)

    try {
        const createdWarehouse = await warehouse.save()
        return [201, createdWarehouse]
    } catch (error) {
        console.error('Failed to create warehouse')
        return getMongoError(error)
    }
}

module.exports.updateWarehouse = async (id, data) => {
    const doc = {
        ...data,
        modifiedAt: moment().unix(),
    }

    try {
        const updatedWarehouse = await WarehouseModel.findByIdAndUpdate(
            { _id: id },
            { $set: doc },
            { new: true, runValidators: true }
        )
        return [200, updatedWarehouse]
    } catch (error) {
        console.error('Failed to update warehouse')
        return getMongoError(error)
    }
}

module.exports.getWarehouseById = async (id) => {
    try {
        const warehouse = await WarehouseModel.findById(id)

        if (!warehouse) return [404, { message: 'Warehouse not found.' }]
        return [200, warehouse]
    } catch (error) {
        console.error('Failed to get warehouse by id')
        return getMongoError(error)
    }
}

module.exports.deleteWarehouseById = async (id) => {
    try {
        await WarehouseModel.deleteOne({ _id: id })
        return [200]
    } catch (error) {
        console.error('Failed to delete warehouse by id')
        return getMongoError(error)
    }
}
