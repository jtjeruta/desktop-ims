const VariantsModule = require('../modules/variants-module')
const ProductsModule = require('../modules/products-module')
const { VariantView } = require('../views/variant-view')

module.exports.createVariant = async (req, res) => {
    const doc = {
        name: req.body.name,
        quantity: req.body.quantity,
        product: req.params.productId,
    }

    const productRes = await ProductsModule.getProductById(doc.product)

    if (!productRes[0] === 200) {
        return res.status(productRes[0]).json(productRes[1])
    }

    const variantRes = await VariantsModule.createVariant(doc)
    if (variantRes[0] !== 201)
        return res.status(variantRes[0]).json(variantRes[1])

    const updateProductRes = await ProductsModule.updateProduct(doc.product, {
        variants: [...productRes[1].variants, variantRes[1]._id],
    })

    if (!updateProductRes[0] === 200) {
        return res.status(updateProductRes[0]).json(updateProductRes[1])
    }

    return res.status(201).json({ variant: VariantView(variantRes[1]) })
}

module.exports.deleteVariant = async (req, res) => {
    const { variantId } = req.params

    const getVariantRes = await VariantsModule.getVariantById(variantId)
    if (getVariantRes[0] !== 200)
        return res.status(getVariantRes[0]).json(getVariantRes[1])

    // Check if product has more than one variants
    const getProductRes = await ProductsModule.getProductById(
        getVariantRes[1].product
    )
    if (getProductRes[0] !== 200)
        return res.status(getProductRes[0]).json(getProductRes[1])

    if (getProductRes[1].variants.length <= 1) {
        return res
            .status(403)
            .json({ message: 'Product must contain atleast 1 unit/variant.' })
    }

    const [status, data] = await VariantsModule.deleteVariantById(variantId)
    if (status !== 200) return res.status(status).json(data)
    return res.status(200).json({ message: 'Variant deleted.' })
}
