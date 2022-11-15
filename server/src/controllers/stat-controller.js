const moment = require('moment')
const mongoose = require('mongoose')
const SalesOrderModule = require('../modules/sales-orders-module')

module.exports.listTopProductSales = async (req, res) => {
    const { fromDate, toDate } = req.query

    const salesOrdersRes = await SalesOrderModule.listSalesOrders({
        orderDate: {
            $gte: fromDate ?? moment().startOf('month').unix(),
            $lte: toDate ?? moment().endOf('day').unix(),
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
