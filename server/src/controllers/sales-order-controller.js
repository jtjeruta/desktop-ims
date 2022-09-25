const SalesOrdersModule = require('../modules/sales-orders-module')
const ProductsModule = require('../modules/products-module')
const CustomersModule = require('../modules/customers-module')
const { SalesOrdersView, SalesOrderView } = require('../views/sales-order-view')

module.exports.createSalesOrder = async (req, res) => {
    const customerRes = await CustomersModule.getCustomerById(req.body.customer)

    if (customerRes[0] !== 200)
        return res.status(customerRes[0]).json(customerRes[1])

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

    // Create sales order
    const createdSalesOrderRes = await SalesOrdersModule.createSalesOrder({
        ...req.body,
        customer: customerRes[1]._id,
    })

    if (createdSalesOrderRes[0] !== 201) {
        return res.status(createdSalesOrderRes[0]).json(createdSalesOrderRes[1])
    }

    // Get populated sales order
    const populatedSalesOrderRes = await SalesOrdersModule.getSalesOrderById(
        createdSalesOrderRes[1]._id
    )

    if (populatedSalesOrderRes[0] !== 200) {
        return res
            .status(populatedSalesOrderRes[0])
            .json(populatedSalesOrderRes[1])
    }

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

    if (req.body.customer) {
        const customerRes = await CustomersModule.getCustomerById(
            req.body.customer
        )
        if (customerRes[0] !== 200)
            return res.status(customerRes[0]).json(customerRes[1])
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

    // Update sales order
    const updatedSalesOrderRes = await SalesOrdersModule.updateSalesOrder(
        salesOrderId,
        req.body
    )

    if (updatedSalesOrderRes[0] !== 200) {
        return res.status(updatedSalesOrderRes[0]).json(updatedSalesOrderRes[1])
    }

    // Get populated sales order
    const populatedSalesOrderRes = await SalesOrdersModule.getSalesOrderById(
        updatedSalesOrderRes[1]._id
    )

    if (populatedSalesOrderRes[0] !== 200) {
        return res
            .status(populatedSalesOrderRes[0])
            .json(populatedSalesOrderRes[1])
    }

    return res
        .status(200)
        .json({ order: SalesOrderView(populatedSalesOrderRes[1]) })
}
