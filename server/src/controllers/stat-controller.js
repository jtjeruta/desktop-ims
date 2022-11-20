const moment = require('moment')
const mongoose = require('mongoose')
const SalesOrderModule = require('../modules/sales-orders-module')
const PurchaseOrderModule = require('../modules/purchase-orders-module')

module.exports.listTopProductSales = async (req, res) => {
    const { startDate, endDate } = req.query

    const salesOrdersRes = await SalesOrderModule.listSalesOrders({
        orderDate: {
            $gte: +(startDate ?? moment().startOf('month').unix()),
            $lte: +(endDate ?? moment().endOf('day').unix()),
        },
    })

    if (salesOrdersRes[0] !== 200) {
        return res.status(salesOrdersRes[0]).json(salesOrdersRes[1])
    }

    const products = salesOrdersRes[1].reduce((acc, order) => {
        order.products.forEach((product) => {
            const productStats = acc.find(
                (p) =>
                    p.product._id.equals(product.product._id) &&
                    p.variant.name === product.variant.name
            ) ?? {
                id: mongoose.Types.ObjectId(),
                product: product.product,
                variant: product.variant,
                quantity: 0,
                total: 0,
            }

            productStats.quantity += product.quantity
            productStats.total += product.totalPrice
            acc = acc.filter(
                (p) => !p.product._id.equals(productStats.product._id)
            )
            acc = [...acc, productStats]
        })

        return acc
    }, [])

    const productsWithSales = products.filter(
        (product, index) => product.quantity > 0 && index <= 9
    )

    return res.status(200).json({ products: productsWithSales })
}

module.exports.listTopProductPurchases = async (req, res) => {
    const { startDate, endDate } = req.query

    const purchaseOrdersRes = await PurchaseOrderModule.listPurchaseOrders({
        orderDate: {
            $gte: startDate ?? moment().startOf('month').unix(),
            $lte: endDate ?? moment().endOf('day').unix(),
        },
    })

    if (purchaseOrdersRes[0] !== 200) {
        return res.status(purchaseOrdersRes[0]).json(purchaseOrdersRes[1])
    }

    const products = purchaseOrdersRes[1].reduce((acc, order) => {
        order.products.forEach((product) => {
            const productStats = acc.find(
                (p) =>
                    p.product._id.equals(product.product._id) &&
                    p.variant.name === product.variant.name
            ) ?? {
                id: mongoose.Types.ObjectId(),
                product: product.product,
                variant: product.variant,
                quantity: 0,
                total: 0,
            }

            productStats.quantity += product.quantity
            productStats.total += product.totalPrice
            acc = acc.filter(
                (p) => !p.product._id.equals(productStats.product._id)
            )
            acc = [...acc, productStats]
        })

        return acc
    }, [])

    const productsWithPurchases = products.filter(
        (product, index) => product.quantity > 0 && index <= 9
    )

    return res.status(200).json({ products: productsWithPurchases })
}
