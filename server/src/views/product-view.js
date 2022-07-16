const { VariantView } = require('./variant-view')
const { WarehouseView } = require('./warehouse-view')

module.exports.ProductsView = (productDocuments) => {
    return productDocuments.map((productDocument) =>
        this.ProductView(productDocument)
    )
}

module.exports.ProductView = (productDocument) => {
    return {
        id: productDocument._id,
        name: productDocument.name,
        brand: productDocument.brand,
        category: productDocument.category,
        subCategory: productDocument.subCategory,
        price: productDocument.price,
        aveUnitCost: productDocument.aveUnitCost,
        markup: productDocument.markup,
        createdAt: productDocument.createdAt,
        modifiedAt: productDocument.modifiedAt,
        published: productDocument.published,
        sku: productDocument.sku,
        storeQty: productDocument.storeQty,
        variants: productDocument.variants.map(VariantView),
        warehouses: productDocument.warehouses.map(WarehouseView),
    }
}
