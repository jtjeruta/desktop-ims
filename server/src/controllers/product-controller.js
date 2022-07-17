const ProductsModule = require('../modules/products-module')
const VariantsModule = require('../modules/variants-module')
const WarehousesModule = require('../modules/warehouses-module')
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
        storeQty: req.body.storeQty,
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

    // fetch product with populated variants
    const getProductRes = await ProductsModule.getProductById(
        createProductRes[1]._id
    )
    if (getProductRes[0] !== 200)
        return res.status(getProductRes[0]).json(getProductRes[1])

    return res.status(201).json({ product: ProductView(getProductRes[1]) })
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
        name: req.body.name,
        price: req.body.price,
        brand: req.body.brand,
        category: req.body.category,
        subCategory: req.body.subCategory,
        published: req.body.published,
        modifiedBy: req.con._id,
    }

    const updateProductRes = await ProductsModule.updateProduct(
        productId,
        updateDoc
    )
    if (updateProductRes[0] !== 200)
        return res.status(updateProductRes[0]).json(updateProductRes[1])

    const getProductRes = await ProductsModule.getProductById(productId)
    if (getProductRes[0] !== 200)
        return res.status(getProductRes[0]).json(getProductRes[1])

    return res.status(200).json({ product: ProductView(getProductRes[1]) })
}

module.exports.deleteProduct = async (req, res) => {
    const { productId } = req.params
    const [status, data] = await ProductsModule.deleteProductById(productId)

    if (status !== 200) return res.status(status).json(data)
    return res.status(200).json({ message: 'Product deleted.' })
}

module.exports.transferStock = async (req, res) => {
    if (req.body.transferFrom === req.body.transferTo) {
        return res.status(400).json({
            message: 'Source is same as destination.',
            errors: {
                transferTo: {
                    message: 'Must not be the same as "Transfer From".',
                },
            },
        })
    }

    if (req.body.amount <= 0) {
        return res.status(400).json({
            message: 'Transfer amount must be greater than 0.',
            errors: { amount: { message: 'Must be greater than 0.' } },
        })
    }

    const [transferFrom, transferTo] = await Promise.all([
        req.body.transferFrom === 'store'
            ? ProductsModule.getProductById(req.params.productId)
            : WarehousesModule.getWarehouseById(req.body.transferFrom),
        req.body.transferTo === 'store'
            ? ProductsModule.getProductById(req.params.productId)
            : WarehousesModule.getWarehouseById(req.body.transferTo),
    ])

    if (transferFrom[0] !== 200) {
        return res.status(transferFrom[0]).json(transferFrom[1])
    }

    if (transferTo[0] !== 200) {
        return res.status(transferTo[0]).json(transferTo[1])
    }

    if (
        req.body.transferFrom === 'store' &&
        transferFrom[1].storeQty < req.body.amount
    ) {
        return res.status(400).json({
            message: 'Transfer amount is greater than stored quantity.',
            errors: {
                amount: { message: 'Must be less than stored quantity.' },
            },
        })
    }

    if (
        req.body.transferFrom !== 'store' &&
        transferFrom[1].quantity < req.body.amount
    ) {
        return res.status(400).json({
            message: 'Transfer amount is greater than stored quantity.',
            errors: {
                amount: { message: 'Must be less than stored quantity.' },
            },
        })
    }

    const [updateFrom, updateTo] = await Promise.all([
        req.body.transferFrom === 'store'
            ? ProductsModule.updateProduct(req.params.productId, {
                  storeQty: (transferFrom[1].storeQty || 0) - req.body.amount,
              })
            : WarehousesModule.updateWarehouse(transferFrom[1]._id, {
                  quantity: transferFrom[1].quantity - req.body.amount,
              }),
        req.body.transferTo === 'store'
            ? ProductsModule.updateProduct(req.params.productId, {
                  storeQty: (transferTo[1].storeQty || 0) + req.body.amount,
              })
            : WarehousesModule.updateWarehouse(transferTo[1]._id, {
                  quantity: transferTo[1].quantity + req.body.amount,
              }),
    ])

    if (updateFrom[0] !== 200) {
        return res.status(updateFrom[0]).json(updateFrom[1])
    }

    if (updateTo[0] !== 200) {
        return res.status(updateTo[0]).json(updateTo[1])
    }

    const updatedProduct = await ProductsModule.getProductById(
        req.params.productId
    )

    if (updatedProduct[0] !== 200) {
        return res.status(updatedProduct[0]).json(updatedProduct[1])
    }

    return res.status(200).json({ product: ProductView(updatedProduct[1]) })
}
