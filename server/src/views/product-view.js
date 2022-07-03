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
    }
}
