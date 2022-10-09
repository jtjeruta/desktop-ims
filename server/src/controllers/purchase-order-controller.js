const PurchaseOrdersModule = require('../modules/purchase-orders-module')
const ProductsModule = require('../modules/products-module')
const VendorsModule = require('../modules/vendors-module')
const {
    PurchaseOrdersView,
    PurchaseOrderView,
} = require('../views/purchase-order-view')

module.exports.createPurchaseOrder = async (req, res) => {
    const vendorRes = await VendorsModule.getVendorById(req.body.vendor)

    if (vendorRes[0] !== 200) return res.status(vendorRes[0]).json(vendorRes[1])

    // Validate products
    const validatedProducts = await Promise.all(
        (req.body.products || []).map((product) =>
            ProductsModule.getProductById(product.product)
        )
    )

    const invalidProduct = validatedProducts.find((p) => p[0] !== 200)

    if (invalidProduct) {
        return res.status(404).json({ message: 'Product not found.' })
    }

    // Create purchase order
    const createdPurchaseOrderRes =
        await PurchaseOrdersModule.createPurchaseOrder({
            ...req.body,
            vendor: vendorRes[1]._id,
        })

    if (createdPurchaseOrderRes[0] !== 201) {
        return res
            .status(createdPurchaseOrderRes[0])
            .json(createdPurchaseOrderRes[1])
    }

    // Get populated purchase order
    const populatedPurchaseOrderRes =
        await PurchaseOrdersModule.getPurchaseOrderById(
            createdPurchaseOrderRes[1]._id
        )

    if (populatedPurchaseOrderRes[0] !== 200) {
        return res
            .status(populatedPurchaseOrderRes[0])
            .json(populatedPurchaseOrderRes[1])
    }

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

    if (req.body.vendor) {
        const vendorRes = await VendorsModule.getVendorById(req.body.vendor)
        if (vendorRes[0] !== 200)
            return res.status(vendorRes[0]).json(vendorRes[1])
    }

    if (req.body.products) {
        const validatedProducts = await Promise.all(
            (req.body.products || []).map((product) =>
                ProductsModule.getProductById(product.product)
            )
        )

        const invalidProduct = validatedProducts.find((p) => p[0] !== 200)

        if (invalidProduct) {
            return res.status(404).json({ message: 'Product not found.' })
        }
    }

    // Update purchase order
    const updatedPurchaseOrderRes =
        await PurchaseOrdersModule.updatePurchaseOrder(
            purchaseOrderId,
            req.body
        )

    if (updatedPurchaseOrderRes[0] !== 200) {
        return res
            .status(updatedPurchaseOrderRes[0])
            .json(updatedPurchaseOrderRes[1])
    }

    // Get populated purchase order
    const populatedPurchaseOrderRes =
        await PurchaseOrdersModule.getPurchaseOrderById(
            updatedPurchaseOrderRes[1]._id
        )

    if (populatedPurchaseOrderRes[0] !== 200) {
        return res
            .status(populatedPurchaseOrderRes[0])
            .json(populatedPurchaseOrderRes[1])
    }

    return res
        .status(200)
        .json({ order: PurchaseOrderView(populatedPurchaseOrderRes[1]) })
}