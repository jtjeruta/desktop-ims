const { default: mongoose } = require('mongoose')
const SalesOrdersModule = require('../modules/sales-orders-module')
const ProductsModule = require('../modules/products-module')
const CustomersModule = require('../modules/customers-module')
const { SalesOrdersView, SalesOrderView } = require('../views/sales-order-view')

module.exports.createSalesOrder = async (req, res) => {
    let customer = null
    const session = await mongoose.startSession()
    session.startTransaction()

    if (req.body.customer) {
        const customerRes = await CustomersModule.getCustomerById(
            req.body.customer,
            session
        )

        if (customerRes[0] !== 200) {
            await session.endSession()
            return res.status(customerRes[0]).json(customerRes[1])
        }

        customer = customerRes[1]
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

    // add original price to products
    const products = (req.body.products || []).map((product) => {
        const foundProduct = validatedProducts.find(
            (p) => p[1]._id.toString() === product.product
        )
        return {
            ...product,
            originalItemPrice: foundProduct[1].sellingPrice,
        }
    })

    // Create sales order
    const createdSalesOrderRes = await SalesOrdersModule.createSalesOrder(
        {
            ...req.body,
            products,
            customer: customer?._id ?? null,
        },
        session
    )

    if (createdSalesOrderRes[0] !== 201) {
        await session.endSession()
        return res.status(createdSalesOrderRes[0]).json(createdSalesOrderRes[1])
    }

    // Get populated sales order
    const populatedSalesOrderRes = await SalesOrdersModule.getSalesOrderById(
        createdSalesOrderRes[1]._id,
        session
    )

    if (populatedSalesOrderRes[0] !== 200) {
        await session.endSession()
        return res
            .status(populatedSalesOrderRes[0])
            .json(populatedSalesOrderRes[1])
    }

    const stockUpdateResponse =
        await SalesOrdersModule.applyProductStockChanges(
            'subtract',
            populatedSalesOrderRes[1],
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
        .json({ order: SalesOrderView(populatedSalesOrderRes[1]) })
}

module.exports.listSalesOrders = async (req, res) => {
    const [status, data] = await SalesOrdersModule.listSalesOrders()
    if (status !== 200) return res.status(status).json(data)
    return res.status(200).json({ orders: SalesOrdersView(data) })
}

module.exports.getSalesOrder = async (req, res) => {
    const [status, data] = await SalesOrdersModule.getSalesOrderById(
        req.params.salesOrderId
    )
    if (status !== 200) return res.status(status).json(data)
    return res.status(200).json({ order: SalesOrderView(data) })
}

module.exports.updateSalesOrder = async (req, res) => {
    const { salesOrderId } = req.params
    const session = await mongoose.startSession()
    session.startTransaction()

    if (req.body.customer) {
        const customerRes = await CustomersModule.getCustomerById(
            req.body.customer,
            session
        )

        if (customerRes[0] !== 200) {
            await session.endSession()
            return res.status(customerRes[0]).json(customerRes[1])
        }
    }

    const foundSalesOrderRes = await SalesOrdersModule.getSalesOrderById(
        salesOrderId,
        session
    )

    if (foundSalesOrderRes[0] !== 200) {
        await session.endSession()
        return res.status(foundSalesOrderRes[0]).json(foundSalesOrderRes[1])
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

        // add original price to products
        const products = req.body.products.map((product) => {
            const foundProduct = validatedProducts.find(
                (p) => p[1]._id.toString() === product.product
            )
            const orderProduct = foundSalesOrderRes[1].products.find(
                (p) => p.product.toString() === product.product
            )
            return {
                ...product,
                originalItemPrice: orderProduct
                    ? orderProduct.originalItemPrice
                    : foundProduct[1].sellingPrice,
            }
        })

        req.body.products = products
    }

    // Update sales order
    const updatedSalesOrderRes = await SalesOrdersModule.updateSalesOrder(
        salesOrderId,
        req.body,
        session
    )

    if (updatedSalesOrderRes[0] !== 200) {
        await session.endSession()
        return res.status(updatedSalesOrderRes[0]).json(updatedSalesOrderRes[1])
    }

    // Get populated sales order
    const populatedSalesOrderRes = await SalesOrdersModule.getSalesOrderById(
        updatedSalesOrderRes[1]._id,
        session
    )

    if (populatedSalesOrderRes[0] !== 200) {
        await session.endSession()
        return res
            .status(populatedSalesOrderRes[0])
            .json(populatedSalesOrderRes[1])
    }

    const undoStockUpdateResponse =
        await SalesOrdersModule.applyProductStockChanges(
            'add',
            foundSalesOrderRes[1],
            session
        )

    if (undoStockUpdateResponse[0] !== 200) {
        await session.endSession()
        return res
            .status(undoStockUpdateResponse[0])
            .json(undoStockUpdateResponse[1])
    }

    const stockUpdateResponse =
        await SalesOrdersModule.applyProductStockChanges(
            'subtract',
            populatedSalesOrderRes[1],
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
        .json({ order: SalesOrderView(populatedSalesOrderRes[1]) })
}

module.exports.deleteSalesOrder = async (req, res) => {
    const { orderId } = req.params
    const [status, data] = await SalesOrdersModule.deleteSalesOrderById(orderId)
    if (status !== 200) return res.status(status).json(data)
    return res.status(200).json({ message: 'Sales order deleted successfully' })
}
