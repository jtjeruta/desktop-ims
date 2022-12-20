const mongoose = require('mongoose')
const ProductsModule = require('../modules/products-module')
const VariantsModule = require('../modules/variants-module')
const WarehousesModule = require('../modules/warehouses-module')
const { ProductsView, ProductView } = require('../views/product-view')

module.exports.createProduct = async (req, res) => {
    const productDoc = {
        sku: ProductsModule.generateSKU(),
        name: req.body.name,
        price: req.body.price,
        company: req.body.company,
        category: req.body.category,
        subCategory: req.body.subCategory,
        aveUnitCost: null,
        published: false,
        stock: req.body.stock,
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
        company: req.body.company,
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
    const session = await mongoose.startSession()
    session.startTransaction()

    if (req.body.transferFrom === req.body.transferTo) {
        await session.endSession()
        return res.status(400).json({
            errors: {
                transferTo: {
                    message: 'Source is same as destination.',
                },
            },
        })
    }

    if ((req.body.amount ?? 0) <= 0) {
        await session.endSession()
        return res.status(400).json({
            errors: { amount: { message: 'Must be greater than 0.' } },
        })
    }

    const [getTransferFromRes, getTransferToRes] = await Promise.all([
        req.body.transferFrom === 'store'
            ? ProductsModule.getProductById(req.params.productId, session)
            : WarehousesModule.getWarehouseById(req.body.transferFrom, session),
        req.body.transferTo === 'store'
            ? ProductsModule.getProductById(req.params.productId, session)
            : WarehousesModule.getWarehouseById(req.body.transferTo, session),
    ])

    if (getTransferFromRes[0] !== 200) {
        await session.endSession()
        return res.status(getTransferFromRes[0]).json({
            errors: { transferFrom: { message: 'Source not found.' } },
        })
    }

    if (getTransferToRes[0] !== 200) {
        await session.endSession()
        return res.status(getTransferToRes[0]).json({
            errors: { transferTo: { message: 'Destination not found.' } },
        })
    }

    const transferFrom =
        req.body.transferFrom === 'store'
            ? getTransferFromRes[1]
            : getTransferFromRes[1].products?.find(
                  (product) =>
                      product.source._id.toString() === req.params.productId
              )

    const transferTo =
        req.body.transferTo === 'store'
            ? getTransferToRes[1]
            : getTransferToRes[1].products?.find(
                  (product) =>
                      product.source._id.toString() === req.params.productId
              )

    // transferFrom is nullish if warehouse -> warehouse and product id is bad
    if (!transferFrom) {
        await session.endSession()
        return res.status(404).json({
            errors: { transferFrom: { message: 'Source not found.' } },
        })
    }

    if (transferFrom.stock < req.body.amount) {
        await session.endSession()
        return res.status(400).json({
            message: 'Transfer amount is greater than stored quantity.',
            errors: {
                amount: { message: 'Must be less than stored quantity.' },
            },
        })
    }

    const newTransferFromStock = (transferFrom.stock ?? 0) - req.body.amount
    const newTransferToStock = (transferTo?.stock ?? 0) + req.body.amount

    const updateStockRes = await Promise.all([
        req.body.transferFrom === 'store'
            ? ProductsModule.updateProduct(
                  req.params.productId,
                  { stock: newTransferFromStock },
                  session
              )
            : WarehousesModule.updateWarehouseProduct(
                  req.body.transferFrom,
                  req.params.productId,
                  newTransferFromStock,
                  session
              ),
        req.body.transferTo === 'store'
            ? ProductsModule.updateProduct(
                  req.params.productId,
                  { stock: newTransferToStock },
                  session
              )
            : WarehousesModule.updateWarehouseProduct(
                  req.body.transferTo,
                  req.params.productId,
                  newTransferToStock,
                  session
              ),
    ])

    const failedUpdateStockRes = updateStockRes.find(
        (result) => result[0] !== 200
    )

    if (failedUpdateStockRes) {
        await session.endSession()
        return res.status(failedUpdateStockRes[0]).json(failedUpdateStockRes[1])
    }

    const updatedProduct = await ProductsModule.getProductById(
        req.params.productId,
        session
    )

    if (updatedProduct[0] !== 200) {
        await session.endSession()
        return res.status(updatedProduct[0]).json(updatedProduct[1])
    }

    await session.commitTransaction()
    await session.endSession()
    return res.status(200).json({ product: ProductView(updatedProduct[1]) })
}
