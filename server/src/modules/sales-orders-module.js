const moment = require('moment')
const { getMongoError } = require('../lib/mongo-errors')
const { SalesOrderModel } = require('../schemas/sales-order-schema')

module.exports.createSalesOrder = async (data = {}) => {
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
        const createdSalesOrder = await salesOrder.save()
        return [201, createdSalesOrder]
    } catch (error) {
        console.error('Failed to create sales order')
        return getMongoError(error)
    }
}

module.exports.updateSalesOrder = async (id, data) => {
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
            { new: true, runValidators: true }
        )
        return [200, updatedSalesOrder]
    } catch (error) {
        console.error('Failed to update sales order')
        return getMongoError(error)
    }
}

module.exports.getSalesOrderById = async (id) => {
    try {
        const salesOrder = await SalesOrderModel.findById(id)
            .populate('customer')
            .populate('products.product')
            .populate('products.product.warehouses')
            .populate('products.warehouse')

        if (!salesOrder) return [404, { message: 'Purchase order not found.' }]
        return [200, salesOrder]
    } catch (error) {
        console.error('Failed to get sales order by id')
        return getMongoError(error)
    }
}

module.exports.listSalesOrders = async () => {
    try {
        const salesOrders = await SalesOrderModel.find()
            .populate('customer')
            .populate('products.product')
        return [200, salesOrders]
    } catch (error) {
        console.error('Failed to list sales orders')
        return getMongoError(error)
    }
}

const calculateProductTotals = (products = []) => {
    const [total, newProducts] = products.reduce(
        (acc, product) => {
            const totalPrice =
                (product.quantity || 0) * (product.itemPrice || 0)
            acc[0] = acc[0] + totalPrice
            acc[1] = [...acc[1], { ...product, totalPrice }]
            return acc
        },
        [0, []]
    )

    return { total, products: newProducts }
}
