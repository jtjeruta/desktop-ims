const ProductsModule = require('../modules/products-module')
const { ProductsView, ProductView } = require('../views/product-view')

module.exports.createProduct = async (req, res) => {
    const doc = {
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
    const [status, data] = await ProductsModule.createProduct(doc)
    if (status !== 201) return res.status(status).json(data)
    return res.status(201).json({ product: ProductView(data) })
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

    if (req.con._id.equals(productId)) {
        return res.status(405).json({ message: 'Not allowed.' })
    }

    const [status, data] = await ProductsModule.deleteProductById(productId)

    if (status !== 200) return res.status(status).json(data)
    return res.status(200).json({ message: 'Product deleted.' })
}
