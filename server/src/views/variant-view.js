module.exports.VariantView = (variantDocument) => {
    return {
        id: variantDocument._id,
        name: variantDocument.name,
        quantity: variantDocument.quantity,
    }
}
