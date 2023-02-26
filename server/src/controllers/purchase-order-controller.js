const { default: mongoose } = require('mongoose')
const PurchaseOrdersModule = require('../modules/purchase-orders-module')
const ProductsModule = require('../modules/products-module')
const VendorsModule = require('../modules/vendors-module')
const {
    PurchaseOrdersView,
    PurchaseOrderView,
} = require('../views/purchase-order-view')

module.exports.createPurchaseOrder = async (req, res) => {
    const session = await mongoose.startSession()
    session.startTransaction()

    const vendorRes = await VendorsModule.getVendorById(
        req.body.vendor,
        session
    )

    if (vendorRes[0] !== 200) {
        await session.endSession()
        return res.status(vendorRes[0]).json(vendorRes[1])
    }

    // Validate products
    const validatedProducts = await Promise.all(
        (req.body.products || []).map((product) =>
            ProductsModule.getProductById(product.product, session)
        )
    )

    const invalidProduct = validatedProducts.find((p) => p[0] !== 200)

    if (invalidProduct) {
        await session.endSession()
        return res.status(404).json({ message: 'Product not found.' })
    }

    // Create purchase order
    const createdPurchaseOrderRes =
        await PurchaseOrdersModule.createPurchaseOrder(
            {
                ...req.body,
                vendor: vendorRes[1]._id,
            },
            session
        )

    if (createdPurchaseOrderRes[0] !== 201) {
        await session.endSession()
        return res
            .status(createdPurchaseOrderRes[0])
            .json(createdPurchaseOrderRes[1])
    }

    // Get populated purchase order
    const populatedPurchaseOrderRes =
        await PurchaseOrdersModule.getPurchaseOrderById(
            createdPurchaseOrderRes[1]._id,
            session
        )

    if (populatedPurchaseOrderRes[0] !== 200) {
        await session.endSession()
        return res
            .status(populatedPurchaseOrderRes[0])
            .json(populatedPurchaseOrderRes[1])
    }

    const stockUpdateResponse =
        await PurchaseOrdersModule.applyProductStockChanges(
            'add',
            populatedPurchaseOrderRes[1],
            session
        )

    if (stockUpdateResponse[0] !== 200) {
        await session.endSession()
        return res.status(stockUpdateResponse[0]).json(stockUpdateResponse[1])
    }

    await session.commitTransaction()
    await session.endSession()
    return res
        .status(201)
        .json({ order: PurchaseOrderView(populatedPurchaseOrderRes[1]) })
}

module.exports.listPurchaseOrders = async (req, res) => {
    const [status, data] = await PurchaseOrdersModule.listPurchaseOrders()
    if (status !== 200) return res.status(status).json(data)
    return res.status(200).json({ orders: PurchaseOrdersView(data) })
}

module.exports.getPurchaseOrder = async (req, res) => {
    const [status, data] = await PurchaseOrdersModule.getPurchaseOrderById(
        req.params.purchaseOrderId
    )
    if (status !== 200) return res.status(status).json(data)
    return res.status(200).json({ order: PurchaseOrderView(data) })
}

module.exports.updatePurchaseOrder = async (req, res) => {
    const { purchaseOrderId } = req.params
    const session = await mongoose.startSession()
    session.startTransaction()

    if (req.body.vendor) {
        const vendorRes = await VendorsModule.getVendorById(
            req.body.vendor,
            session
        )

        if (vendorRes[0] !== 200) {
            await session.endSession()
            return res.status(vendorRes[0]).json(vendorRes[1])
        }
    }

    if (req.body.products) {
        const validatedProducts = await Promise.all(
            (req.body.products || []).map((product) =>
                ProductsModule.getProductById(product.product, session)
            )
        )

        const invalidProduct = validatedProducts.find((p) => p[0] !== 200)

        if (invalidProduct) {
            await session.endSession()
            return res.status(404).json({ message: 'Product not found.' })
        }
    }

    const foundPurchaseOrderRes =
        await PurchaseOrdersModule.getPurchaseOrderById(
            purchaseOrderId,
            session
        )

    if (foundPurchaseOrderRes[0] !== 200) {
        await session.endSession()
        return res
            .status(foundPurchaseOrderRes[0])
            .json(foundPurchaseOrderRes[1])
    }

    // Update purchase order
    const updatedPurchaseOrderRes =
        await PurchaseOrdersModule.updatePurchaseOrder(
            purchaseOrderId,
            req.body,
            session
        )

    if (updatedPurchaseOrderRes[0] !== 200) {
        await session.endSession()
        return res
            .status(updatedPurchaseOrderRes[0])
            .json(updatedPurchaseOrderRes[1])
    }

    // Get populated purchase order
    const populatedPurchaseOrderRes =
        await PurchaseOrdersModule.getPurchaseOrderById(
            updatedPurchaseOrderRes[1]._id,
            session
        )

    if (populatedPurchaseOrderRes[0] !== 200) {
        await session.endSession()
        return res
            .status(populatedPurchaseOrderRes[0])
            .json(populatedPurchaseOrderRes[1])
    }

    const undoStockUpdateResponse =
        await PurchaseOrdersModule.applyProductStockChanges(
            'subtract',
            foundPurchaseOrderRes[1],
            session
        )

    if (undoStockUpdateResponse[0] !== 200) {
        await session.endSession()
        return res
            .status(undoStockUpdateResponse[0])
            .json(undoStockUpdateResponse[1])
    }

    const stockUpdateResponse =
        await PurchaseOrdersModule.applyProductStockChanges(
            'add',
            populatedPurchaseOrderRes[1],
            session
        )

    if (stockUpdateResponse[0] !== 200) {
        await session.endSession()
        return res.status(stockUpdateResponse[0]).json(stockUpdateResponse[1])
    }

    await session.commitTransaction()
    await session.endSession()
    return res
        .status(200)
        .json({ order: PurchaseOrderView(populatedPurchaseOrderRes[1]) })
}

module.exports.deletePurchaseOrder = async (req, res) => {
    const { orderId } = req.params
    const [status, data] = await PurchaseOrdersModule.deletePurchaseOrderById(
        orderId
    )
    if (status !== 200) return res.status(status).json(data)
    return res
        .status(200)
        .json({ message: 'Purchase order deleted successfully' })
}
