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
        console.error(error)
        console.error('Failed to create warehouse')
        return getMongoError(error)
    }
}

module.exports.updateWarehouse = async (id, data, session = null) => {
    const doc = {
        ...data,
        modifiedAt: moment().unix(),
    }

    try {
        const updatedWarehouse = await WarehouseModel.findByIdAndUpdate(
            { _id: id },
            { $set: doc },
            { new: true, runValidators: true, session }
        )
        return [200, updatedWarehouse]
    } catch (error) {
        console.error('Failed to update warehouse')
        return getMongoError(error)
    }
}

module.exports.updateWarehouseProduct = async (
    warehouseId,
    productId,
    stock,
    session = null
) => {
    let warehouse = null

    try {
        warehouse = await WarehouseModel.findById(warehouseId).session(session)
    } catch (err) {
        console.error('Failed to get warehouse')
        return getMongoError(err)
    }

    let wProducts = warehouse?.products ?? []
    if (!wProducts.some((wp) => wp.source.equals(productId))) {
        wProducts = [...wProducts, { source: productId, stock }]
    } else {
        wProducts = wProducts.map((wp) => {
            if (wp.source.equals(productId)) {
                wp.stock = stock
            }
            return wp
        })
    }

    try {
        await WarehouseModel.updateOne(
            { _id: warehouseId },
            { $set: { products: wProducts } },
            { new: true, runValidators: true, session }
        )
    } catch (err) {
        console.error('Failed to update warehouse product')
        return getMongoError(err)
    }

    return this.getWarehouseById(warehouseId)
}

module.exports.getWarehouseById = async (id, session = null) => {
    try {
        const warehouse = await WarehouseModel.findById(id)
            .populate('products.source')
            .session(session)

        if (!warehouse) return [404, { message: 'Warehouse not found.' }]
        return [200, warehouse]
    } catch (error) {
        console.error('Failed to get warehouse by id')
        return getMongoError(error)
    }
}

module.exports.listWarehouses = async (query = {}, session = null) => {
    try {
        const warehouses = await WarehouseModel.find(query)
            .populate('products.source')
            .session(session)

        return [200, warehouses]
    } catch (error) {
        console.error('Failed to get warehouses')
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

module.exports.deleteWarehouses = async (query = {}) => {
    try {
        await WarehouseModel.deleteMany(query)
        return [200]
    } catch (error) {
        console.error('Failed to delete warehouses')
        return getMongoError(error)
    }
}
