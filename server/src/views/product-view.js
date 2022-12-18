const { VariantView } = require('./variant-view')

module.exports.ProductsView = (productDocuments) => {
    return productDocuments.map((productDocument) =>
        this.ProductView(productDocument)
    )
}

module.exports.ProductView = (productDocument) => {
    return {
        id: productDocument._id,
        name: productDocument.name,
        company: productDocument.company,
        category: productDocument.category,
        subCategory: productDocument.subCategory,
        price: productDocument.price,
        aveUnitCost: productDocument.aveUnitCost,
        markup: productDocument.markup,
        createdAt: productDocument.createdAt,
        modifiedAt: productDocument.modifiedAt,
        published: productDocument.published,
        sku: productDocument.sku,
        stock: productDocument.stock,
        variants: productDocument.variants?.map(VariantView) ?? [],
    }
}
