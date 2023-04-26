const mongoose = require('mongoose')
const ProductsModule = require('../modules/products-module')
const VariantsModule = require('../modules/variants-module')
const WarehousesModule = require('../modules/warehouses-module')
const { ProductsView, ProductView } = require('../views/product-view')

module.exports.createProduct = async (req, res) => {
    const productDoc = {
        sku: ProductsModule.generateSKU(),
        name: req.body.name,
        sellingPrice: req.body.sellingPrice,
        costPrice: req.body.costPrice,
        company: req.body.company,
        category: req.body.category,
        subCategory: req.body.subCategory,
        published: false,
        stock: req.body.stock,
        reorderPoint: req.body.reorderPoint,
        modifiedBy: req.con._id,
    }

    const duplicateProductRes = await ProductsModule.getProduct({
        $or: [{ name: productDoc.name }, { sku: productDoc.sku }],
        archived: false,
    })

    if (duplicateProductRes[0] !== 404)
        return res.status(409).json({ message: 'Product already exists.' })

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
    const [status, data] = await ProductsModule.getProduct({
        $or: [{ id: req.params.productId }, { sku: req.params.productId }],
        archived: false,
    })

    if (status !== 200) return res.status(status).json(data)
    return res.status(200).json({ product: ProductView(data) })
}

module.exports.listProducts = async (req, res) => {
    const [status, data] = await ProductsModule.listProducts({
        archived: false,
    })

    if (status !== 200) return res.status(status).json(data)

    const products = ProductsView(data)
    return res.status(200).json({ products })
}

module.exports.updateProduct = async (req, res) => {
    const session = await mongoose.startSession()
    session.startTransaction()

    try {
        const { productId } = req.params
        let updateDoc = [
            'name',
            'sellingPrice',
            'costPrice',
            'company',
            'category',
            'subCategory',
            'published',
            'reorderPoint',
        ].reduce((acc, key) => {
            if (req.body[key] !== undefined) acc[key] = req.body[key]
            return acc
        }, {})
        updateDoc.modifiedBy = req.con._id

        const [duplicateProductRes, warehousesRes] = await Promise.all([
            ProductsModule.getProduct(
                {
                    $or: [{ name: updateDoc.name }, { sku: updateDoc.sku }],
                    archived: false,
                    _id: { $ne: productId },
                },
                session
            ),
            WarehousesModule.listWarehouses({ product: productId }, session),
        ])

        if (duplicateProductRes[0] !== 404) {
            await session.endSession()
            return res.status(409).json({ message: 'Product already exists.' })
        }

        if (warehousesRes[0] !== 200) {
            await session.endSession()
            return res.status(warehousesRes[0]).json(warehousseRes[1])
        }

        const orgProductRes = await ProductsModule.getProductById(
            productId,
            session
        )
        if (orgProductRes[0] !== 200) {
            await session.endSession()
            return res.status(orgProductRes[0]).json(orgProductRes[1])
        }

        let newProductId = null
        if (
            (updateDoc.sellingPrice || updateDoc.costPrice) &&
            (orgProductRes[1].sellingPrice !== updateDoc.sellingPrice ||
                orgProductRes[1].costPrice !== updateDoc.costPrice)
        ) {
            const doc = { ...orgProductRes[1]._doc, ...updateDoc }
            delete doc._id
            const createProductRes = await ProductsModule.createProduct(
                doc,
                session
            )

            if (createProductRes[0] !== 201) {
                await session.endSession()
                return res.status(createProductRes[0]).json(createProductRes[1])
            }

            newProductId = createProductRes[1].id
            updateDoc = { archived: true }

            await Promise.all(
                warehousesRes[1].map((wh) => {
                    const p = wh.products.find((p) => p.source.id === productId)
                    return WarehousesModule.updateWarehouseProduct(
                        wh.id,
                        newProductId,
                        p.stock,
                        session
                    )
                })
            )
        }

        const updateProductRes = await ProductsModule.updateProduct(
            productId,
            updateDoc,
            session
        )
        if (updateProductRes[0] !== 200) {
            await session.endSession()
            return res.status(updateProductRes[0]).json(updateProductRes[1])
        }

        const getProductRes = await ProductsModule.getProductById(
            newProductId ?? productId,
            session
        )
        if (getProductRes[0] !== 200) {
            await session.endSession()
            return res.status(getProductRes[0]).json(getProductRes[1])
        }

        await session.commitTransaction()
        await session.endSession()

        return res.status(200).json({ product: ProductView(getProductRes[1]) })
    } catch (e) {
        console.error(e)
        await session.abortTransaction()
        await session.endSession()
        return res.status(500).json({ message: 'Internal server error.' })
    }
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
