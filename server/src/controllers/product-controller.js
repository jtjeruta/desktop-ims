const ProductsModule = require('../modules/products-module')
const VariantsModule = require('../modules/variants-module')
const { ProductsView, ProductView } = require('../views/product-view')

module.exports.createProduct = async (req, res) => {
    const productDoc = {
        sku: ProductsModule.generateSKU(),
        name: req.body.name,
        price: req.body.price,
        brand: req.body.brand,
        category: req.body.category,
        subCategory: req.body.subCategory,
        aveUnitCost: null,
        published: false,
        modifiedBy: req.con._id,
    }
    const createProductRes = await ProductsModule.createProduct(productDoc)
    if (createProductRes[0] !== 201)
        return res.status(createProductRes[0]).json(createProductRes[1])

    // create default variant
    const variantDoc = {
        name: 'default',
        quantity: 1,
        product: createProductRes[1]._id,
    }
    const createVariantRes = await VariantsModule.createVariant(variantDoc)
    if (createVariantRes[0] !== 201)
        return res.status(createVariantRes[0]).json(createVariantRes[1])

    // Insert variant into product
    const updateProductRes = await ProductsModule.updateProduct(
        createProductRes[1]._id,
        {
            variants: [
                ...createProductRes[1].variants,
                createVariantRes[1]._id,
            ],
        }
    )
    if (updateProductRes[0] !== 200) {
        return res.status(updateProductRes[0]).json(updateProductRes[1])
    }

    return res.status(201).json({ product: ProductView(updateProductRes[1]) })
}

module.exports.getProduct = async (req, res) => {
    const [status, data] = await ProductsModule.getProductById(
        req.params.productId
    )

    if (status !== 200) return res.status(status).json(data)
    return res.status(200).json({ product: ProductView(data) })
}

module.exports.listProducts = async (req, res) => {
    const [status, data] = await ProductsModule.listProducts()

    if (status !== 200) return res.status(status).json(data)

    const products = ProductsView(data)
    return res.status(200).json({ products })
}

module.exports.updateProduct = async (req, res) => {
    const { productId } = req.params
    const updateDoc = {
        ...req.body,
        modifiedBy: req.con._id,
    }

    const [status, data] = await ProductsModule.updateProduct(
        productId,
        updateDoc
    )

    if (status !== 200) return res.status(status).json(data)
    return res.status(200).json({ product: ProductView(data) })
}

module.exports.deleteProduct = async (req, res) => {
    const { productId } = req.params
    const [status, data] = await ProductsModule.deleteProductById(productId)

    if (status !== 200) return res.status(status).json(data)
    return res.status(200).json({ message: 'Product deleted.' })
}
