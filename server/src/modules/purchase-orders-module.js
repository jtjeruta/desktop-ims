const moment = require('moment')
const { getMongoError } = require('../lib/mongo-errors')
const { PurchaseOrderModel } = require('../schemas/purchase-order-schema')
const ProductsModule = require('../modules/products-module')
const WarehousesModule = require('../modules/warehouses-module')

module.exports.createPurchaseOrder = async (data = {}, session = null) => {
    const { total, products } = calculateProductTotals(data.products)

    const doc = {
        ...data,
        products,
        total,
        createdAt: moment().unix(),
        modifiedAt: moment().unix(),
    }

    const purchaseOrder = new PurchaseOrderModel(doc)

    try {
        const createdPurchaseOrder = await purchaseOrder.save({ session })
        return [201, createdPurchaseOrder]
    } catch (error) {
        console.error('Failed to create purchase order: ', error)
        return getMongoError(error)
    }
}

module.exports.updatePurchaseOrder = async (id, data, session = null) => {
    let doc = {
        ...data,
        modifiedAt: moment().unix(),
    }

    if (doc.products) {
        const { total, products } = calculateProductTotals(doc.products)
        doc = { ...doc, products, total }
    }

    try {
        const updatedPurchaseOrder = await PurchaseOrderModel.findByIdAndUpdate(
            { _id: id },
            { $set: doc },
            { new: true, runValidators: true, session }
        )
        return [200, updatedPurchaseOrder]
    } catch (error) {
        console.error('Failed to update purchase order: ', error)
        return getMongoError(error)
    }
}

module.exports.getPurchaseOrderById = async (id, session = null) => {
    try {
        const purchaseOrder = await PurchaseOrderModel.findById(id)
            .populate('vendor')
            .populate('products.product')
            .populate('products.warehouse')
            .session(session)

        if (!purchaseOrder)
            return [404, { message: 'Purchase order not found.' }]
        return [200, purchaseOrder]
    } catch (error) {
        console.error('Failed to get purchase order by id: ', error)
        return getMongoError(error)
    }
}

module.exports.listPurchaseOrders = async (query = {}, session = null) => {
    try {
        const purchaseOrders = await PurchaseOrderModel.find(query)
            .populate('vendor')
            .populate('products.product')
            .populate('products.warehouse')
            .session(session)
        return [200, purchaseOrders]
    } catch (error) {
        console.error('Failed to list purchase orders: ', error)
        return getMongoError(error)
    }
}

module.exports.applyProductStockChanges = async (
    type = 'add',
    purchaseOrder,
    session
) => {
    let response = null

    for (let product of purchaseOrder.products) {
        const total = product.quantity * (product.variant?.quantity ?? 1)

        if (product.warehouse) {
            const warehouseRes = await WarehousesModule.getWarehouseById(
                product.warehouse,
                session
            )

            if (warehouseRes[0] !== 200) {
                response = warehouseRes
                break
            }

            const warehouseProduct = warehouseRes[1].products?.find((wp) =>
                wp.source._id.equals(product.product._id)
            )

            const currentStock = warehouseProduct?.stock ?? 0
            const newStock =
                type === 'add' ? currentStock + total : currentStock - total

            response = await WarehousesModule.updateWarehouseProduct(
                warehouseRes[1]._id,
                product.product._id,
                newStock,
                session
            )
        } else {
            const productRes = await ProductsModule.getProductById(
                product.product,
                session
            )

            if (productRes[0] !== 200) {
                response = productRes
                break
            }

            const { stock } = productRes[1]
            const newStock = type === 'add' ? stock + total : stock - total

            response = await ProductsModule.updateProduct(
                product.product._id,
                { stock: newStock },
                session
            )
        }

        if (response[0] !== 200) {
            break
        }
    }

    if (response === null) {
        return [200]
    } else {
        return response
    }
}

module.exports.deletePurchaseOrderById = async (orderId, session = null) => {
    try {
        const deletedPurchaseOrder = await PurchaseOrderModel.deleteOne(
            { _id: orderId },
            session
        )
        return [200, deletedPurchaseOrder]
    } catch (error) {
        console.error('Failed to delete purchase order by id: ', error)
        return getMongoError(error)
    }
}

module.exports.deletePurchaseOrders = async (query = {}, session = null) => {
    try {
        await PurchaseOrderModel.deleteMany(query, { session })
        return [200]
    } catch (error) {
        console.error('Failed to delete purchase orders: ', error)
        return getMongoError(error)
    }
}

const calculateProductTotals = (products = []) => {
    const [total, newProducts] = products.reduce(
        (acc, product) => {
            const totalPrice =
                (product.quantity || 0) *
                (product.variant?.quantity ?? 1) *
                (product.itemPrice || 0)
            acc[0] = acc[0] + totalPrice
            acc[1] = [...acc[1], { ...product, totalPrice }]
            return acc
        },
        [0, []]
    )

    return { total, products: newProducts }
}
