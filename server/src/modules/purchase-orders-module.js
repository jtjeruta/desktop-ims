const moment = require('moment')
const { getMongoError } = require('../lib/mongo-errors')
const { PurchaseOrderModel } = require('../schemas/purchase-order-schema')

module.exports.createPurchaseOrder = async (data = {}) => {
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
        const createdPurchaseOrder = await purchaseOrder.save()
        return [201, createdPurchaseOrder]
    } catch (error) {
        console.error('Failed to create purchase order')
        return getMongoError(error)
    }
}

module.exports.updatePurchaseOrder = async (id, data) => {
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
            { new: true, runValidators: true }
        )
        return [200, updatedPurchaseOrder]
    } catch (error) {
        console.error('Failed to update purchase order')
        return getMongoError(error)
    }
}

module.exports.getPurchaseOrderById = async (id) => {
    try {
        const purchaseOrder = await PurchaseOrderModel.findById(id)
            .populate('vendor')
            .populate('products.product')

        if (!purchaseOrder)
            return [404, { message: 'Purchase order not found.' }]
        return [200, purchaseOrder]
    } catch (error) {
        console.error('Failed to get purchase order by id')
        return getMongoError(error)
    }
}

module.exports.listPurchaseOrders = async () => {
    try {
        const purchaseOrders = await PurchaseOrderModel.find()
            .populate('vendor')
            .populate('products.product')
        return [200, purchaseOrders]
    } catch (error) {
        console.error('Failed to list purchase orders')
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
