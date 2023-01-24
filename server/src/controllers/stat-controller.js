const moment = require('moment')
const SalesOrderModule = require('../modules/sales-orders-module')
const PurchaseOrderModule = require('../modules/purchase-orders-module')
const ProductModule = require('../modules/products-module')
const WarehouseModule = require('../modules/warehouses-module')
const { ProductView } = require('../views/product-view')
const { VariantView } = require('../views/variant-view')

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

            const variants = product.variants.map((variant) => {
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
                        purQty += orderProduct.quantity
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
                        salesQty += orderProduct.quantity
                    })
                )

                const avePur = purQty > 0 ? totalPur / purQty : 0
                const aveSales = salesQty > 0 ? totalSales / salesQty : 0

                return {
                    id: variant._id,
                    product: ProductView(product),
                    variant: VariantView(variant),
                    stock: totalStock,
                    totalPur,
                    purQty,
                    totalSales,
                    salesQty,
                    avePur,
                    aveSales,
                }
            })

            return [...acc, ...variants]
        }, [])

        return res.status(200).json({ productReports })
    } catch (err) {
        return res
            .status(500)
            .json({ message: 'Failed to list product reports' })
    }
}
