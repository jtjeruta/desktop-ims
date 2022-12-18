const { ProductView } = require('./product-view')

module.exports.WarehouseView = (warehouseDocument) => {
    return {
        id: warehouseDocument._id,
        name: warehouseDocument.name,
        products: warehouseDocument.products.map((product) => ({
            source: ProductView(product.source),
            stock: product.stock,
        })),
    }
}
