const moment = require('moment')
const SalesOrderModule = require('../modules/sales-orders-module')

module.exports.getTopProducts = async (req, res) => {
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
            const productStats = acc.find((p) =>
                p.id.equals(product.product._id)
            ) ?? {
                id: product.product._id,
                // data: product.product,
                quantity: 0,
                total: 0,
            }

            productStats.quantity += product.quantity
            productStats.total += product.totalPrice
            acc = acc.filter((p) => !p.id.equals(product.product._id))
            acc = [...acc, productStats]
        })

        return acc
    }, [])

    return res.status(200).json({ products })
}
