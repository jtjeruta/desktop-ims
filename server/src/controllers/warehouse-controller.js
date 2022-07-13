const WarehousesModule = require('../modules/warehouses-module')
const ProductsModule = require('../modules/products-module')
const { WarehouseView } = require('../views/warehouse-view')

module.exports.createWarehouse = async (req, res) => {
    const doc = {
        name: req.body.name,
        quantity: req.body.quantity,
        product: req.params.productId,
    }

    const productRes = await ProductsModule.getProductById(doc.product)

    if (!productRes[0] === 200) {
        return res.status(productRes[0]).json(productRes[1])
    }

    const warehouseRes = await WarehousesModule.createWarehouse(doc)
    if (warehouseRes[0] !== 201)
        return res.status(warehouseRes[0]).json(warehouseRes[1])

    const updateProductRes = await ProductsModule.updateProduct(doc.product, {
        warehouses: [...productRes[1].warehouses, warehouseRes[1]._id],
    })

    if (!updateProductRes[0] === 200) {
        return res.status(updateProductRes[0]).json(updateProductRes[1])
    }

    return res.status(201).json({ warehouse: WarehouseView(warehouseRes[1]) })
}

module.exports.deleteWarehouse = async (req, res) => {
    const { warehouseId } = req.params

    const getWarehouseRes = await WarehousesModule.getWarehouseById(warehouseId)
    if (getWarehouseRes[0] !== 200)
        return res.status(getWarehouseRes[0]).json(getWarehouseRes[1])

    const [status, data] = await WarehousesModule.deleteWarehouseById(
        warehouseId
    )
    if (status !== 200) return res.status(status).json(data)
    return res.status(200).json({ message: 'Warehouse deleted.' })
}
