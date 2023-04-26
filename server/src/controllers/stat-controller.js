const moment = require('moment')
const SalesOrderModule = require('../modules/sales-orders-module')
const PurchaseOrderModule = require('../modules/purchase-orders-module')
const ProductModule = require('../modules/products-module')
const WarehouseModule = require('../modules/warehouses-module')
const ExpenseModule = require('../modules/expenses-module')
const ReceivableModule = require('../modules/receivables-module')

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

module.exports.listProductPurchaseReports = async (req, res) => {
    try {
        const { startDate, endDate } = getDateRangeFromQuery(req.query)

        const [purchaseOrdersRes, productsRes, warehousesRes] =
            await Promise.all([
                PurchaseOrderModule.listPurchaseOrders({
                    orderDate: { $gte: startDate, $lte: endDate },
                }),
                ProductModule.listProducts(),
                WarehouseModule.listWarehouses(),
            ])

        if (purchaseOrdersRes[0] !== 200) {
            return res.status(purchaseOrdersRes[0]).json(purchaseOrdersRes[1])
        }

        if (productsRes[0] !== 200) {
            return res.status(productsRes[0]).json(productsRes[1])
        }

        if (warehousesRes[0] !== 200) {
            return res.status(warehousesRes[0]).json(warehousesRes[1])
        }

        const purchaseReports = purchaseOrdersRes[1]
            .reduce((acc, order) => {
                order.products.forEach((product) => {
                    const warehouseStocks = warehousesRes[1].reduce(
                        (acc, wh) => {
                            wh.products.forEach((whp) => {
                                if (!whp.source._id.equals(product.product?.id))
                                    return
                                acc += whp.stock
                            })

                            return acc
                        },
                        0
                    )

                    const foundVariant = acc.find((variant) => {
                        return (
                            variant.productId.equals(product.product._id) &&
                            variant.variant === product.variant.name
                        )
                    }) ?? {
                        productId: product.product._id,
                        productName: product.product.name,
                        variant: product.variant.name,
                        price: product.itemPrice,
                        originalPrice: product.product?.costPrice ?? 0,
                        currentStock:
                            (product.product?.stock ?? 0) + warehouseStocks,
                        items: [],
                    }

                    foundVariant.items = [
                        ...foundVariant.items,
                        {
                            qty: product.quantity * product.variant.quantity,
                            cost: product.itemPrice,
                        },
                    ]
                    acc = acc.filter(
                        (v) =>
                            !(
                                v.productId.equals(foundVariant.productId) &&
                                v.variant === foundVariant.variant
                            )
                    )
                    acc.push(foundVariant)
                })

                return acc
            }, [])
            .map((variant) => {
                const aveCost = this.calculateAverageCost(
                    variant.currentStock,
                    variant.originalPrice,
                    variant.items
                )

                const totalQty = variant.items.reduce(
                    (acc, item) => acc + item.qty,
                    0
                )

                const id = variant.productId.toString() + variant.variant
                return { ...variant, aveCost, qty: totalQty, id }
            })

        return res.status(200).json({ purchaseReports })
    } catch (err) {
        return res
            .status(500)
            .json({ message: 'Failed to list product purchase reports' })
    }
}

module.exports.listProductSalesReports = async (req, res) => {
    try {
        const { startDate, endDate } = getDateRangeFromQuery(req.query)

        const [salesOrdersRes, productsRes, warehousesRes] = await Promise.all([
            SalesOrderModule.listSalesOrders({
                orderDate: { $gte: startDate, $lte: endDate },
            }),
            ProductModule.listProducts(),
            WarehouseModule.listWarehouses(),
        ])

        if (salesOrdersRes[0] !== 200) {
            return res.status(salesOrdersRes[0]).json(salesOrdersRes[1])
        }

        if (productsRes[0] !== 200) {
            return res.status(productsRes[0]).json(productsRes[1])
        }

        if (warehousesRes[0] !== 200) {
            return res.status(warehousesRes[0]).json(warehousesRes[1])
        }

        const salesReports = salesOrdersRes[1]
            .reduce((acc, order) => {
                order.products.forEach((product) => {
                    const warehouseStocks = warehousesRes[1].reduce(
                        (acc, wh) => {
                            wh.products.forEach((whp) => {
                                if (!whp.source._id.equals(product.product?.id))
                                    return
                                acc += whp.stock
                            })

                            return acc
                        },
                        0
                    )

                    const foundVariant = acc.find((variant) => {
                        return (
                            variant.productId.equals(product.product._id) &&
                            variant.variant === product.variant.name
                        )
                    }) ?? {
                        productId: product.product._id,
                        productName: product.product.name,
                        variant: product.variant.name,
                        price: product.itemPrice,
                        originalPrice: product.product?.sellingPrice ?? 0,
                        currentStock:
                            (product.product?.stock ?? 0) + warehouseStocks,
                        items: [],
                    }

                    foundVariant.items = [
                        ...foundVariant.items,
                        {
                            qty: product.quantity * product.variant.quantity,
                            price: product.itemPrice,
                        },
                    ]
                    acc = acc.filter(
                        (v) =>
                            !(
                                v.productId.equals(foundVariant.productId) &&
                                v.variant === foundVariant.variant
                            )
                    )
                    acc.push(foundVariant)
                })

                return acc
            }, [])
            .map((variant) => {
                const avePrice = this.calculateAverageSales(
                    variant.currentStock,
                    variant.originalPrice,
                    variant.items
                )

                const totalQty = variant.items.reduce(
                    (acc, item) => acc + item.qty,
                    0
                )

                const id = variant.productId.toString() + variant.variant
                return { ...variant, avePrice, qty: totalQty, id }
            })

        return res.status(200).json({ salesReports })
    } catch (err) {
        return res
            .status(500)
            .json({ message: 'Failed to list product sales reports' })
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

module.exports.calculateAverageSales = (currentQty, currentPrice, sales) => {
    let totalPrice = 0
    let totalQty = 0

    for (let purchase of sales) {
        totalQty += purchase.qty
        totalPrice += purchase.qty * purchase.price
    }

    const prevQty = currentQty + totalQty
    totalPrice += prevQty * currentPrice

    return totalPrice / (totalQty + prevQty)
}
