module.exports.WarehouseView = (warehouseDocument) => {
    return {
        id: warehouseDocument._id,
        name: warehouseDocument.name,
        quantity: warehouseDocument.quantity,
    }
}
