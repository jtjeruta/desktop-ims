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
        sellingPrice: productDocument.sellingPrice,
        costPrice: productDocument.costPrice,
        createdAt: productDocument.createdAt,
        modifiedAt: productDocument.modifiedAt,
        published: productDocument.published,
        sku: productDocument.sku,
        stock: productDocument.stock,
        reorderPoint: productDocument.reorderPoint,
        variants: productDocument.variants?.map(VariantView) ?? [],
    }
}
