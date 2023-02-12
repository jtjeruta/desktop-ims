const moment = require('moment')
const { getMongoError } = require('../lib/mongo-errors')
const { SalesOrderModel } = require('../schemas/sales-order-schema')
const ProductsModule = require('../modules/products-module')
const WarehousesModule = require('../modules/warehouses-module')

module.exports.createSalesOrder = async (data = {}, session = null) => {
    const { total, products } = calculateProductTotals(data.products)

    const doc = {
        ...data,
        products,
        total,
        createdAt: moment().unix(),
        modifiedAt: moment().unix(),
    }

    const salesOrder = new SalesOrderModel(doc)

    try {
        const createdSalesOrder = await salesOrder.save({ session })
        return [201, createdSalesOrder]
    } catch (error) {
        console.error('Failed to create sales order')
        return getMongoError(error)
    }
}

module.exports.updateSalesOrder = async (id, data, session = null) => {
    let doc = {
        ...data,
        modifiedAt: moment().unix(),
    }

    if (doc.products) {
        const { total, products } = calculateProductTotals(doc.products)
        doc = { ...doc, products, total }
    }

    try {
        const updatedSalesOrder = await SalesOrderModel.findByIdAndUpdate(
            { _id: id },
            { $set: doc },
            { new: true, runValidators: true, session }
        )
        return [200, updatedSalesOrder]
    } catch (error) {
        console.error('Failed to update sales order')
        return getMongoError(error)
    }
}

module.exports.getSalesOrderById = async (id, session = null) => {
    try {
        const salesOrder = await SalesOrderModel.findById(id)
            .populate('customer')
            .populate('products.product')
            .populate('products.warehouse')
            .session(session)

        if (!salesOrder) return [404, { message: 'Sales order not found.' }]
        return [200, salesOrder]
    } catch (error) {
        console.error('Failed to get sales order by id')
        return getMongoError(error)
    }
}

module.exports.listSalesOrders = async (query = {}, session = null) => {
    try {
        const salesOrders = await SalesOrderModel.find(query)
            .populate('customer')
            .populate('products.product')
            .populate('products.warehouse')
            .session(session)
        return [200, salesOrders]
    } catch (error) {
        console.error('Failed to list sales orders')
        return getMongoError(error)
    }
}

module.exports.applyProductStockChanges = async (
    type = 'add',
    salesOrder,
    session
) => {
    let response = null

    for (let product of salesOrder.products) {
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

module.exports.deleteSalesOrders = async (query = {}, session = null) => {
    try {
        const deletedSalesOrders = await SalesOrderModel.deleteMany(
            query,
            session
        )
        return [200, deletedSalesOrders]
    } catch (error) {
        console.error('Failed to delete sales orders')
        return getMongoError(error)
    }
}
