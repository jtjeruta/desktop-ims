const WarehousesModule = require('../modules/warehouses-module')
const { WarehouseView } = require('../views/warehouse-view')

module.exports.listWarehouses = async (req, res) => {
    const warehousesRes = await WarehousesModule.listWarehouses()

    if (warehousesRes[0] !== 200)
        return res.status(warehousesRes[0]).json(warehousesRes[1])

    // remove archived products from each warehouse
    const warehouses = warehousesRes[1].map((warehouse) => {
        warehouse.products = warehouse.products.filter(
            (product) => !product.source.archived
        )
        return warehouse
    })

    return res.status(200).json({ warehouses: warehouses.map(WarehouseView) })
}

module.exports.getWarehouse = async (req, res) => {
    const warehouseRes = await WarehousesModule.getWarehouseById(
        req.params.warehouseId
    )

    if (warehouseRes[0] !== 200)
        return res.status(warehouseRes[0]).json(warehouseRes[1])

    return res.status(200).json({ warehouse: WarehouseView(warehouseRes[1]) })
}

module.exports.createWarehouse = async (req, res) => {
    const doc = {
        name: req.body.name,
    }

    const warehouseRes = await WarehousesModule.createWarehouse(doc)
    if (warehouseRes[0] !== 201)
        return res.status(warehouseRes[0]).json(warehouseRes[1])

    return res.status(201).json({ warehouse: WarehouseView(warehouseRes[1]) })
}

module.exports.updateWarehouse = async (req, res) => {
    const { warehouseId } = req.params
    const doc = {
        name: req.body.name,
    }

    const warehouseRes = await WarehousesModule.updateWarehouse(
        warehouseId,
        doc
    )

    if (warehouseRes[0] !== 200)
        return res.status(warehouseRes[0]).json(warehouseRes[1])

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
