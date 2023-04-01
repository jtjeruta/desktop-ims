const moment = require('moment')
const SalesOrderModule = require('../modules/sales-orders-module')
const PurchaseOrderModule = require('../modules/purchase-orders-module')
const ProductModule = require('../modules/products-module')
const WarehouseModule = require('../modules/warehouses-module')
const ExpenseModule = require('../modules/expenses-module')
const ReceivableModule = require('../modules/receivables-module')
const { ProductView } = require('../views/product-view')

module.exports.getTotalProductSales = async (req, res) => {
    const { startDate, endDate } = getDateRangeFromQuery(req.query)

    const salesOrdersRes = await SalesOrderModule.listSalesOrders({
        orderDate: { $gte: startDate, $lte: endDate },
    })

    if (salesOrdersRes[0] !== 200) {
        return res.status(salesOrdersRes[0]).json(salesOrdersRes[1])
    }

    const total = salesOrdersRes[1].reduce((acc, order) => acc + order.total, 0)
    return res.status(200).json({ totalSales: total })
}

module.exports.getTotalProductPurchases = async (req, res) => {
    const { startDate, endDate } = getDateRangeFromQuery(req.query)

    const purchaseOrdersRes = await PurchaseOrderModule.listPurchaseOrders({
        orderDate: { $gte: startDate, $lte: endDate },
    })

    if (purchaseOrdersRes[0] !== 200) {
        return res.status(purchaseOrdersRes[0]).json(purchaseOrdersRes[1])
    }

    const total = purchaseOrdersRes[1].reduce(
        (acc, order) => acc + order.total,
        0
    )
    return res.status(200).json({ totalPurchases: total })
}

module.exports.getTotalExpenses = async (req, res) => {
    const { startDate, endDate } = getDateRangeFromQuery(req.query)

    const expensesRes = await ExpenseModule.listExpenses({
        date: { $gte: startDate, $lte: endDate },
    })

    if (expensesRes[0] !== 200) {
        return res.status(expensesRes[0]).json(expensesRes[1])
    }

    const total = expensesRes[1].reduce(
        (acc, expense) => acc + expense.amount,
        0
    )
    return res.status(200).json({ totalExpenses: total })
}

const getDateRangeFromQuery = (query) => {
    return {
        startDate: +(query.startDate ?? moment().startOf('month').unix()),
        endDate: +(query.endDate ?? moment().endOf('day').unix()),
    }
}

module.exports.listProductReports = async (req, res) => {
    try {
        const { startDate, endDate } = getDateRangeFromQuery(req.query)

        const [purchaseOrdersRes, salesOrdersRes, productsRes, warehousesRes] =
            await Promise.all([
                PurchaseOrderModule.listPurchaseOrders({
                    orderDate: { $gte: startDate, $lte: endDate },
                }),
                SalesOrderModule.listSalesOrders({
                    orderDate: { $gte: startDate, $lte: endDate },
                }),
                ProductModule.listProducts(),
                WarehouseModule.listWarehouses(),
            ])

        if (purchaseOrdersRes[0] !== 200) {
            return res.status(purchaseOrdersRes[0]).json(purchaseOrdersRes[1])
        }

        if (salesOrdersRes[0] !== 200) {
            return res.status(salesOrdersRes[0]).json(salesOrdersRes[1])
        }

        if (productsRes[0] !== 200) {
            return res.status(productsRes[0]).json(productsRes[1])
        }

        if (warehousesRes[0] !== 200) {
            return res.status(warehousesRes[0]).json(warehousesRes[1])
        }

        const productReports = productsRes[1].reduce((acc, product) => {
            const warehouseStock = warehousesRes[1].reduce((acc, warehouse) => {
                warehouse.products.forEach((whp) => {
                    if (!whp.source._id.equals(product._id)) return
                    acc += whp.stock
                })

                return acc
            }, 0)

            const totalStock = warehouseStock + product.stock
            let purchases = []
            let sales = []

            const variants = product.variants
                .map((variant) => {
                    let totalPur = 0
                    let purQty = 0
                    let totalSales = 0
                    let salesQty = 0

                    purchaseOrdersRes[1].forEach((order) =>
                        order.products.forEach((orderProduct) => {
                            if (
                                orderProduct.variant.name !== variant.name ||
                                !product._id.equals(orderProduct.product._id)
                            )
                                return
                            totalPur += orderProduct.totalPrice
                            const varQty =
                                orderProduct.quantity *
                                (orderProduct.variant?.quantity ?? 0)
                            purchases = [
                                ...purchases,
                                { cost: orderProduct.itemPrice, qty: varQty },
                            ]
                            purQty += varQty
                        })
                    )

                    salesOrdersRes[1].forEach((order) =>
                        order.products.forEach((orderProduct) => {
                            if (
                                orderProduct.variant.name !== variant.name ||
                                !product._id.equals(orderProduct.product._id)
                            )
                                return
                            totalSales += orderProduct.totalPrice
                            const varQty =
                                orderProduct.quantity *
                                (orderProduct.variant?.quantity ?? 0)
                            sales = [
                                ...sales,
                                { cost: orderProduct.itemPrice, qty: varQty },
                            ]
                            salesQty += varQty
                        })
                    )

                    return {
                        totalPur,
                        purQty,
                        totalSales,
                        salesQty,
                    }
                })
                .filter(
                    (variant) => variant.totalPur > 0 || variant.totalSales > 0
                )

            if (variants.length === 0) return acc

            const totalPur = variants.reduce(
                (acc, variant) => acc + variant.totalPur,
                0
            )

            const totalSales = variants.reduce(
                (acc, variant) => acc + variant.totalSales,
                0
            )

            const purQty = variants.reduce(
                (acc, variant) => acc + variant.purQty,
                0
            )

            const salesQty = variants.reduce(
                (acc, variant) => acc + variant.salesQty,
                0
            )

            const avePur = this.calculateAverageCost(
                totalStock,
                product.costPrice,
                purchases
            )
            const aveSales = this.calculateAverageSales(
                totalStock,
                product.sellingPrice,
                sales
            )

            const productReport = {
                id: product._id,
                product: ProductView(product),
                stock: totalStock,
                totalPur,
                totalSales,
                purQty,
                salesQty,
                avePur,
                aveSales,
            }

            return [...acc, productReport]
        }, [])

        return res.status(200).json({ productReports })
    } catch (err) {
        return res
            .status(500)
            .json({ message: 'Failed to list product reports' })
    }
}

module.exports.getTotalReceivables = async (req, res) => {
    const { startDate, endDate } = getDateRangeFromQuery(req.query)

    const receivablesRes = await ReceivableModule.listReceivables({
        date: { $gte: startDate, $lte: endDate },
    })

    if (receivablesRes[0] !== 200) {
        return res.status(receivablesRes[0]).json(receivablesRes[1])
    }

    const total = receivablesRes[1].reduce(
        (acc, receivable) => acc + receivable.amount,
        0
    )
    return res.status(200).json({ totalReceivables: total })
}

module.exports.calculateAverageCost = (currentQty, currentCost, purchases) => {
    let totalCost = 0
    let totalQty = 0

    for (let purchase of purchases) {
        totalQty += purchase.qty
        totalCost += purchase.qty * purchase.cost
    }

    const prevQty = currentQty - totalQty
    totalCost += prevQty * currentCost

    return totalCost / (totalQty + prevQty)
}

module.exports.calculateAverageSales = (currentQty, currentCost, purchases) => {
    let totalCost = 0
    let totalQty = 0

    for (let purchase of purchases) {
        totalQty += purchase.qty
        totalCost += purchase.qty * purchase.cost
    }

    const prevQty = currentQty + totalQty
    totalCost += prevQty * currentCost

    return totalCost / (totalQty + prevQty)
}
