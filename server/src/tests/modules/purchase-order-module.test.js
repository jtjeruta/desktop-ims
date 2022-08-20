const { expect } = require('chai')

const PurchaseOrdersModule = require('../../modules/purchase-orders-module')
const ProductsModule = require('../../modules/products-module')
const VendorsModule = require('../../modules/vendors-module')
const setup = require('../setup')
const testdata = require('../testdata')

describe('Module: Create Purchase Order', () => {
    setup()
    let product = null
    let vendor = null

    beforeEach(async () => {
        product = (await ProductsModule.createProduct(testdata.product1))[1]
        vendor = (await VendorsModule.createVendor(testdata.vendor1))[1]
    })

    it('Success: using correct data', async () => {
        const createdPurchaseOrder =
            await PurchaseOrdersModule.createPurchaseOrder({
                products: [
                    {
                        product: product._id,
                        quantity: 100,
                        itemPrice: 10,
                    },
                ],
                vendor: vendor._id,
            })

        expect(createdPurchaseOrder[0]).to.equal(201)
        expect(createdPurchaseOrder[1].products[0].totalPrice).to.equal(1000)
        expect(createdPurchaseOrder[1].total).to.equal(1000)
    })

    it('Fail: using invalid data', async () => {
        const createdPurchaseOrder =
            await PurchaseOrdersModule.createPurchaseOrder({})

        expect(createdPurchaseOrder[0]).to.equal(400)
        expect(createdPurchaseOrder[1].errors.vendor.message).to.equal(
            'Path `vendor` is required.'
        )
        expect(createdPurchaseOrder[1].errors.products.message).to.equal(
            'Path `products` must contain atleast 1.'
        )
    })
})

describe('Module: List PurchaseOrders', () => {
    setup()

    it('Success: list all purchase orders', async () => {
        product = (await ProductsModule.createProduct(testdata.product1))[1]
        vendor = (await VendorsModule.createVendor(testdata.vendor1))[1]

        await PurchaseOrdersModule.createPurchaseOrder({
            products: [
                {
                    product: product._id,
                    quantity: 100,
                    itemPrice: 10,
                },
            ],
            vendor: vendor._id,
        })

        const purchaseOrders = await PurchaseOrdersModule.listPurchaseOrders()
        expect(purchaseOrders[0]).to.equal(200)
        expect(purchaseOrders[1].length).to.equal(1)
        expect(purchaseOrders[1][0].vendor.name).to.equal(testdata.vendor1.name)
        expect(purchaseOrders[1][0].products[0].product.name).to.equal(
            testdata.product1.name
        )
    })
})

describe('Module: Get PurchaseOrder by id', () => {
    setup()

    let product, vendor, purchaseOrder

    beforeEach(async () => {
        product = (await ProductsModule.createProduct(testdata.product1))[1]
        vendor = (await VendorsModule.createVendor(testdata.vendor1))[1]

        purchaseOrder = (
            await PurchaseOrdersModule.createPurchaseOrder({
                products: [
                    {
                        product: product._id,
                        quantity: 100,
                        itemPrice: 10,
                    },
                ],
                vendor: vendor._id,
            })
        )[1]
    })

    it('Success: given correct id', async () => {
        const foundPurchaseOrder =
            await PurchaseOrdersModule.getPurchaseOrderById(purchaseOrder._id)

        expect(foundPurchaseOrder[0]).to.equal(200)
        expect(foundPurchaseOrder[1]._id.toString()).to.equal(
            purchaseOrder._id.toString()
        )
        expect(foundPurchaseOrder[1].vendor.name).to.equal(
            testdata.vendor1.name
        )
        expect(foundPurchaseOrder[1].products[0].product.name).to.equal(
            testdata.product1.name
        )
    })

    it('Fail: given wrong id', async () => {
        const foundPurchaseOrder =
            await PurchaseOrdersModule.getPurchaseOrderById(null)
        expect(foundPurchaseOrder[0]).to.equal(404)
        expect(foundPurchaseOrder[1]).to.deep.equal({
            message: 'Purchase order not found.',
        })
    })
})

describe('Module: Update PurchaseOrder', () => {
    setup()

    let product1, product2, vendor, purchaseOrder

    beforeEach(async () => {
        product1 = (await ProductsModule.createProduct(testdata.product1))[1]
        product2 = (await ProductsModule.createProduct(testdata.product2))[1]
        vendor = (await VendorsModule.createVendor(testdata.vendor1))[1]

        purchaseOrder = (
            await PurchaseOrdersModule.createPurchaseOrder({
                products: [
                    {
                        product: product1._id,
                        quantity: 100,
                        itemPrice: 10,
                    },
                ],
                vendor: vendor._id,
            })
        )[1]
    })

    it('Success: using correct data', async () => {
        const updatedPurchaseOrder =
            await PurchaseOrdersModule.updatePurchaseOrder(purchaseOrder._id, {
                products: [
                    ...purchaseOrder.products,
                    {
                        product: product2._id,
                        quantity: 200,
                        itemPrice: 20,
                    },
                ],
            })

        expect(updatedPurchaseOrder[0]).to.equal(200)
        expect(updatedPurchaseOrder[1].products.length).to.equal(2)
        expect(updatedPurchaseOrder[1].total).to.equal(5000)
    })

    it('Fail: using invalid data', async () => {
        const updatedPurchaseOrder =
            await PurchaseOrdersModule.updatePurchaseOrder(purchaseOrder._id, {
                products: [],
                vendor: null,
            })

        expect(updatedPurchaseOrder[0]).to.equal(400)
        expect(updatedPurchaseOrder[1].errors.vendor.message).to.equal(
            'Path `vendor` is required.'
        )
        expect(updatedPurchaseOrder[1].errors.products.message).to.equal(
            'Path `products` must contain atleast 1.'
        )
    })
})
