const { expect } = require('chai')

const PurchaseOrdersModule = require('../../modules/purchase-orders-module')
const ProductsModule = require('../../modules/products-module')
const WarehousesModule = require('../../modules/warehouses-module')
const VendorsModule = require('../../modules/vendors-module')
const setup = require('../setup')
const testdata = require('../testdata')

describe('Module: Create Purchase Order', () => {
    setup()
    let product = null
    let vendor = null
    let warehouse = null

    beforeEach(async () => {
        product = (await ProductsModule.createProduct(testdata.product1))[1]
        warehouse = (
            await WarehousesModule.createWarehouse({
                ...testdata.warehouse1,
                product: product._id,
            })
        )[1]
        vendor = (await VendorsModule.createVendor(testdata.vendor1))[1]
    })

    it('Success: using correct data', async () => {
        const createdPurchaseOrder =
            await PurchaseOrdersModule.createPurchaseOrder({
                products: [
                    {
                        id: 'test_product_1',
                        product: product._id,
                        quantity: 100,
                        itemPrice: 10,
                        warehouse: warehouse._id,
                        variant: {
                            name: 'Test Variant',
                            quantity: 10,
                        },
                    },
                ],
                vendor: vendor._id,
                orderDate: 12345,
                invoiceNumber: 'invoice-number',
            })

        expect(createdPurchaseOrder[0]).to.equal(201)
        expect(createdPurchaseOrder[1].products[0].totalPrice).to.equal(1000)
        expect(createdPurchaseOrder[1].orderDate).to.equal(12345)
        expect(createdPurchaseOrder[1].invoiceNumber).to.equal('invoice-number')
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
        const product = (
            await ProductsModule.createProduct(testdata.product1)
        )[1]
        const vendor = (await VendorsModule.createVendor(testdata.vendor1))[1]
        const warehouse = (
            await WarehousesModule.createWarehouse({
                ...testdata.warehouse1,
                product: product._id,
            })
        )[1]

        await PurchaseOrdersModule.createPurchaseOrder({
            products: [
                {
                    id: 'test_product_1',
                    product: product._id,
                    quantity: 100,
                    itemPrice: 10,
                    warehouse: warehouse._id,
                    variant: {
                        name: 'Test Variant',
                        quantity: 10,
                    },
                },
            ],
            vendor: vendor._id,
            orderDate: 12345,
            invoiceNumber: 'invoice-number',
        })

        const purchaseOrders = await PurchaseOrdersModule.listPurchaseOrders()
        expect(purchaseOrders[0]).to.equal(200)
        expect(purchaseOrders[1].length).to.equal(1)
        expect(purchaseOrders[1][0].vendor.name).to.equal(testdata.vendor1.name)
        expect(purchaseOrders[1][0].products[0].product.name).to.equal(
            testdata.product1.name
        )
        expect(purchaseOrders[1][0].orderDate).to.equal(12345)
        expect(purchaseOrders[1][0].invoiceNumber).to.equal('invoice-number')
    })
})

describe('Module: Get PurchaseOrder by id', () => {
    setup()

    let product, vendor, purchaseOrder

    beforeEach(async () => {
        product = (await ProductsModule.createProduct(testdata.product1))[1]
        vendor = (await VendorsModule.createVendor(testdata.vendor1))[1]
        warehouse = (
            await WarehousesModule.createWarehouse({
                ...testdata.warehouse1,
                product: product._id,
            })
        )[1]

        purchaseOrder = (
            await PurchaseOrdersModule.createPurchaseOrder({
                products: [
                    {
                        id: 'test_product_1',
                        product: product._id,
                        quantity: 100,
                        itemPrice: 10,
                        warehouse: warehouse._id,
                        variant: {
                            name: 'Test Variant',
                            quantity: 10,
                        },
                    },
                ],
                vendor: vendor._id,
                orderDate: 12345,
                invoiceNumber: 'invoice-number',
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
        expect(foundPurchaseOrder[1].orderDate).to.equal(12345)
        expect(foundPurchaseOrder[1].invoiceNumber).to.equal('invoice-number')
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

    let product1, product2, vendor, purchaseOrder, warehouse

    beforeEach(async () => {
        product1 = (await ProductsModule.createProduct(testdata.product1))[1]
        product2 = (await ProductsModule.createProduct(testdata.product2))[1]
        vendor = (await VendorsModule.createVendor(testdata.vendor1))[1]
        warehouse = (
            await WarehousesModule.createWarehouse({
                ...testdata.warehouse1,
                product: product1._id,
            })
        )[1]

        purchaseOrder = (
            await PurchaseOrdersModule.createPurchaseOrder({
                products: [
                    {
                        id: 'test_product_1',
                        product: product1._id,
                        quantity: 100,
                        itemPrice: 10,
                        warehouse: warehouse._id,
                        variant: {
                            name: 'Test Variant',
                            quantity: 10,
                        },
                    },
                ],
                vendor: vendor._id,
                orderDate: 12345,
                invoiceNumber: 'invoice-number',
            })
        )[1]
    })

    it('Success: using correct data', async () => {
        const updatedPurchaseOrder =
            await PurchaseOrdersModule.updatePurchaseOrder(purchaseOrder._id, {
                products: [
                    ...purchaseOrder.products,
                    {
                        id: 'test_product_2',
                        product: product2._id,
                        quantity: 200,
                        itemPrice: 20,
                        warehouse: warehouse._id,
                        variant: {
                            name: 'Test Variant',
                            quantity: 10,
                        },
                    },
                ],
                orderDate: 54321,
                invoiceNumber: 'new-invoice-number',
            })

        expect(updatedPurchaseOrder[0]).to.equal(200)
        expect(updatedPurchaseOrder[1].products.length).to.equal(2)
        expect(updatedPurchaseOrder[1].orderDate).to.equal(54321)
        expect(updatedPurchaseOrder[1].invoiceNumber).to.equal(
            'new-invoice-number'
        )
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

describe('Module: Apply Product Stock Changes', () => {
    setup()
    let product, vendor, warehouse

    beforeEach(async () => {
        product = (await ProductsModule.createProduct(testdata.product1))[1]
        vendor = (await VendorsModule.createVendor(testdata.vendor1))[1]
        warehouse = (
            await WarehousesModule.createWarehouse({
                ...testdata.warehouse1,
                product: product._id,
            })
        )[1]
        await ProductsModule.updateProduct(product._id, {
            warehouses: [warehouse._id],
        })
    })

    it('Success: add stock changes to store', async () => {
        const { _id: purchaseOrderId } = (
            await PurchaseOrdersModule.createPurchaseOrder({
                products: [
                    {
                        id: 'test_product_1',
                        product: product._id,
                        quantity: 100,
                        itemPrice: 10,
                        warehouse: null,
                        variant: {
                            name: 'Test Variant',
                            quantity: 10,
                        },
                    },
                ],
                vendor: vendor._id,
                orderDate: 12345,
                invoiceNumber: 'invoice-number',
            })
        )[1]

        const purchaseOrder = (
            await PurchaseOrdersModule.getPurchaseOrderById(purchaseOrderId)
        )[1]

        const response = await PurchaseOrdersModule.applyProductStockChanges(
            'add',
            purchaseOrder
        )

        const alteredProduct = (await ProductsModule.getProductById(product))[1]

        expect(response[0]).to.equal(200)
        expect(alteredProduct.storeQty).to.equal(1000)
    })

    it('Success: add stock changes to warehouse', async () => {
        const { _id: purchaseOrderId } = (
            await PurchaseOrdersModule.createPurchaseOrder({
                products: [
                    {
                        id: 'test_product_1',
                        product: product._id,
                        quantity: 100,
                        itemPrice: 10,
                        warehouse,
                        variant: {
                            name: 'Test Variant',
                            quantity: 10,
                        },
                    },
                ],
                vendor: vendor._id,
                orderDate: 12345,
                invoiceNumber: 'invoice-number',
            })
        )[1]

        const purchaseOrder = (
            await PurchaseOrdersModule.getPurchaseOrderById(purchaseOrderId)
        )[1]

        await PurchaseOrdersModule.applyProductStockChanges(
            'add',
            purchaseOrder
        )
        const alteredProduct = (await ProductsModule.getProductById(product))[1]
        expect(alteredProduct.storeQty).to.equal(0)
        expect(alteredProduct.warehouses[0].quantity).to.equal(1010)
    })

    it('Success: subtract stock changes from store', async () => {
        const { _id: purchaseOrderId } = (
            await PurchaseOrdersModule.createPurchaseOrder({
                products: [
                    {
                        id: 'test_product_1',
                        product: product._id,
                        quantity: 100,
                        itemPrice: 10,
                        warehouse: null,
                        variant: {
                            name: 'Test Variant',
                            quantity: 10,
                        },
                    },
                ],
                vendor: vendor._id,
                orderDate: 12345,
                invoiceNumber: 'invoice-number',
            })
        )[1]

        const purchaseOrder = (
            await PurchaseOrdersModule.getPurchaseOrderById(purchaseOrderId)
        )[1]

        const response = await PurchaseOrdersModule.applyProductStockChanges(
            'subtract',
            purchaseOrder
        )

        const alteredProduct = (await ProductsModule.getProductById(product))[1]

        expect(response[0]).to.equal(200)
        expect(alteredProduct.storeQty).to.equal(-1000)
    })

    it('Success: subtract stock changes from warehouse', async () => {
        const { _id: purchaseOrderId } = (
            await PurchaseOrdersModule.createPurchaseOrder({
                products: [
                    {
                        id: 'test_product_1',
                        product: product._id,
                        quantity: 100,
                        itemPrice: 10,
                        warehouse,
                        variant: {
                            name: 'Test Variant',
                            quantity: 10,
                        },
                    },
                ],
                vendor: vendor._id,
                orderDate: 12345,
                invoiceNumber: 'invoice-number',
            })
        )[1]

        const purchaseOrder = (
            await PurchaseOrdersModule.getPurchaseOrderById(purchaseOrderId)
        )[1]

        await PurchaseOrdersModule.applyProductStockChanges(
            'subtract',
            purchaseOrder
        )
        const alteredProduct = (await ProductsModule.getProductById(product))[1]
        expect(alteredProduct.storeQty).to.equal(0)
        expect(alteredProduct.warehouses[0].quantity).to.equal(-990)
    })
})
