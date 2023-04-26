const { expect } = require('chai')
const moment = require('moment')

const SalesOrdersModule = require('../../modules/sales-orders-module')
const ProductsModule = require('../../modules/products-module')
const CustomersModule = require('../../modules/customers-module')
const WarehousesModule = require('../../modules/warehouses-module')
const setup = require('../setup')
const testdata = require('../testdata')

describe('Module: Create Sales Order', () => {
    setup()
    let product = null
    let customer = null
    let warehouse = null

    beforeEach(async () => {
        product = (await ProductsModule.createProduct(testdata.product1))[1]
        customer = (await CustomersModule.createCustomer(testdata.customer1))[1]
        warehouse = (
            await WarehousesModule.createWarehouse(testdata.warehouse1)
        )[1]
    })

    it('Success: using correct data', async () => {
        const createdSalesOrder = await SalesOrdersModule.createSalesOrder({
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
            customer: customer._id,
            orderDate: 12345,
            invoiceNumber: 'invoice-number-1',
        })

        expect(createdSalesOrder[0]).to.equal(201)
        expect(createdSalesOrder[1].products[0].totalPrice).to.equal(10000)
        expect(createdSalesOrder[1].orderDate).to.equal(12345)
        expect(createdSalesOrder[1].invoiceNumber).to.equal('invoice-number-1')
        expect(createdSalesOrder[1].total).to.equal(10000)
    })

    it('Success: with no customer', async () => {
        const createdSalesOrder = await SalesOrdersModule.createSalesOrder({
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
            customer: null,
            orderDate: 12345,
            invoiceNumber: 'invoice-number-1',
        })

        expect(createdSalesOrder[0]).to.equal(201)
        expect(createdSalesOrder[1].products[0].totalPrice).to.equal(10000)
        expect(createdSalesOrder[1].orderDate).to.equal(12345)
        expect(createdSalesOrder[1].invoiceNumber).to.equal('invoice-number-1')
        expect(createdSalesOrder[1].total).to.equal(10000)
    })

    it('Fail: using invalid data', async () => {
        const createdSalesOrder = await SalesOrdersModule.createSalesOrder({
            orderDate: moment(),
        })

        expect(createdSalesOrder[0]).to.equal(400)
        expect(createdSalesOrder[1].errors.products.message).to.equal(
            'Path `products` must contain atleast 1.'
        )
    })
})

describe('Module: List SalesOrders', () => {
    setup()

    it('Success: list all sales orders', async () => {
        const product = (
            await ProductsModule.createProduct(testdata.product1)
        )[1]
        const customer = (
            await CustomersModule.createCustomer(testdata.customer1)
        )[1]
        const warehouse = (
            await WarehousesModule.createWarehouse(testdata.warehouse1)
        )[1]

        await SalesOrdersModule.createSalesOrder({
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
            customer: customer._id,
            orderDate: 12345,
            invoiceNumber: 'invoice-number-1',
        })

        const salesOrders = await SalesOrdersModule.listSalesOrders()
        expect(salesOrders[0]).to.equal(200)
        expect(salesOrders[1].length).to.equal(1)
        expect(salesOrders[1][0].customer.name).to.equal(
            testdata.customer1.name
        )
        expect(salesOrders[1][0].orderDate).to.equal(12345)
        expect(salesOrders[1][0].invoiceNumber).to.equal('invoice-number-1')
        expect(salesOrders[1][0].products[0].product.name).to.equal(
            testdata.product1.name
        )
    })
})

describe('Module: Get SalesOrder by id', () => {
    setup()

    let product, customer, salesOrder, warehouse

    beforeEach(async () => {
        product = (await ProductsModule.createProduct(testdata.product1))[1]
        customer = (await CustomersModule.createCustomer(testdata.customer1))[1]
        warehouse = (
            await WarehousesModule.createWarehouse(testdata.warehouse1)
        )[1]

        salesOrder = (
            await SalesOrdersModule.createSalesOrder({
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
                customer: customer._id,
                orderDate: 12345,
                invoiceNumber: 'invoice-number-1',
            })
        )[1]
    })

    it('Success: given correct id', async () => {
        const foundSalesOrder = await SalesOrdersModule.getSalesOrderById(
            salesOrder._id
        )

        expect(foundSalesOrder[0]).to.equal(200)
        expect(foundSalesOrder[1]._id.toString()).to.equal(
            salesOrder._id.toString()
        )
        expect(foundSalesOrder[1].customer.name).to.equal(
            testdata.customer1.name
        )
        expect(foundSalesOrder[1].products[0].product.name).to.equal(
            testdata.product1.name
        )
        expect(foundSalesOrder[1].orderDate).to.equal(12345)
        expect(foundSalesOrder[1].invoiceNumber).to.equal('invoice-number-1')
    })

    it('Fail: given wrong id', async () => {
        const foundSalesOrder = await SalesOrdersModule.getSalesOrderById(null)
        expect(foundSalesOrder[0]).to.equal(404)
        expect(foundSalesOrder[1]).to.deep.equal({
            message: 'Sales order not found.',
        })
    })
})

describe('Module: Update SalesOrder', () => {
    setup()

    let product1, product2, customer, salesOrder, warehouse

    beforeEach(async () => {
        product1 = (await ProductsModule.createProduct(testdata.product1))[1]
        product2 = (await ProductsModule.createProduct(testdata.product2))[1]
        customer = (await CustomersModule.createCustomer(testdata.customer1))[1]
        warehouse = (
            await WarehousesModule.createWarehouse(testdata.warehouse1)
        )[1]

        salesOrder = (
            await SalesOrdersModule.createSalesOrder({
                products: [
                    {
                        id: 'test_product_1',
                        product: product1._id,
                        quantity: 100,
                        itemPrice: 10,
                        warehouse,
                        variant: {
                            name: 'Test Variant',
                            quantity: 10,
                        },
                    },
                ],
                customer: customer._id,
                orderDate: 12345,
                invoiceNumber: 'invoice-number-1',
            })
        )[1]
    })

    it('Success: using correct data', async () => {
        const updatedSalesOrder = await SalesOrdersModule.updateSalesOrder(
            salesOrder._id,
            {
                products: [
                    ...salesOrder.products,
                    {
                        id: 'test_product_2',
                        product: product2._id,
                        quantity: 200,
                        itemPrice: 20,
                        warehouse,
                        variant: {
                            name: 'Test Variant',
                            quantity: 5,
                        },
                    },
                ],
                orderDate: 54321,
                invoiceNumber: 'new-invoice-number-1',
            }
        )

        expect(updatedSalesOrder[0]).to.equal(200)
        expect(updatedSalesOrder[1].products.length).to.equal(2)
        expect(updatedSalesOrder[1].orderDate).to.equal(54321)
        expect(updatedSalesOrder[1].invoiceNumber).to.equal(
            'new-invoice-number-1'
        )
        expect(updatedSalesOrder[1].total).to.equal(30000)
    })

    it('Fail: using invalid data', async () => {
        const updatedSalesOrder = await SalesOrdersModule.updateSalesOrder(
            salesOrder._id,
            {
                products: [],
                customer: null,
            }
        )

        expect(updatedSalesOrder[0]).to.equal(400)
        expect(updatedSalesOrder[1].errors.products.message).to.equal(
            'Path `products` must contain atleast 1.'
        )
    })
})

describe('Module: Apply Product Stock Changes', () => {
    setup()
    let product, customer, warehouse

    beforeEach(async () => {
        product = (await ProductsModule.createProduct(testdata.product1))[1]
        customer = (await CustomersModule.createCustomer(testdata.customer1))[1]
        warehouse = (
            await WarehousesModule.createWarehouse(testdata.warehouse1)
        )[1]
    })

    it('Success: add stock changes to store', async () => {
        const { _id: salesOrderId } = (
            await SalesOrdersModule.createSalesOrder({
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
                customer: customer._id,
                orderDate: 12345,
                invoiceNumber: 'invoice-number',
            })
        )[1]

        const salesOrder = (
            await SalesOrdersModule.getSalesOrderById(salesOrderId)
        )[1]

        const response = await SalesOrdersModule.applyProductStockChanges(
            'add',
            salesOrder
        )

        const alteredProduct = (await ProductsModule.getProductById(product))[1]

        expect(response[0]).to.equal(200)
        expect(alteredProduct.stock).to.equal(1000)
    })

    it('Success: add stock changes to warehouse', async () => {
        const { _id: salesOrderId } = (
            await SalesOrdersModule.createSalesOrder({
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
                customer: customer._id,
                orderDate: 12345,
                invoiceNumber: 'invoice-number',
            })
        )[1]

        const salesOrder = (
            await SalesOrdersModule.getSalesOrderById(salesOrderId)
        )[1]

        await SalesOrdersModule.applyProductStockChanges('add', salesOrder)
        const alteredProduct = (await ProductsModule.getProductById(product))[1]
        expect(alteredProduct.stock).to.equal(0)

        const alteredWarehouse = (
            await WarehousesModule.getWarehouseById(warehouse)
        )[1]
        expect(alteredWarehouse.products[0].stock).to.equal(1000)
    })

    it('Success: subtract stock changes from store', async () => {
        const { _id: salesOrderId } = (
            await SalesOrdersModule.createSalesOrder({
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
                customer: customer._id,
                orderDate: 12345,
                invoiceNumber: 'invoice-number',
            })
        )[1]

        const salesOrder = (
            await SalesOrdersModule.getSalesOrderById(salesOrderId)
        )[1]

        const response = await SalesOrdersModule.applyProductStockChanges(
            'subtract',
            salesOrder
        )

        const alteredProduct = (await ProductsModule.getProductById(product))[1]

        expect(response[0]).to.equal(200)
        expect(alteredProduct.stock).to.equal(-1000)
    })

    it('Success: subtract stock changes from warehouse', async () => {
        const { _id: salesOrderId } = (
            await SalesOrdersModule.createSalesOrder({
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
                customer: customer._id,
                orderDate: 12345,
                invoiceNumber: 'invoice-number',
            })
        )[1]

        const salesOrder = (
            await SalesOrdersModule.getSalesOrderById(salesOrderId)
        )[1]

        await SalesOrdersModule.applyProductStockChanges('subtract', salesOrder)
        const alteredProduct = (await ProductsModule.getProductById(product))[1]
        expect(alteredProduct.stock).to.equal(0)

        const alteredWarehouse = (
            await WarehousesModule.getWarehouseById(warehouse)
        )[1]
        expect(alteredWarehouse.products[0].stock).to.equal(-1000)
    })
})

describe('Module: Delete SalesOrder', () => {
    setup()

    let product1, customer, salesOrder, warehouse

    beforeEach(async () => {
        product1 = (await ProductsModule.createProduct(testdata.product1))[1]
        customer = (await CustomersModule.createCustomer(testdata.customer1))[1]
        warehouse = (
            await WarehousesModule.createWarehouse(testdata.warehouse1)
        )[1]

        salesOrder = (
            await SalesOrdersModule.createSalesOrder({
                products: [
                    {
                        id: 'test_product_1',
                        product: product1._id,
                        quantity: 100,
                        itemPrice: 10,
                        warehouse,
                        variant: {
                            name: 'Test Variant',
                            quantity: 10,
                        },
                    },
                ],
                customer: customer._id,
                orderDate: 12345,
                invoiceNumber: 'invoice-number-1',
            })
        )[1]
    })

    it('Success: using correct data', async () => {
        const deletedSalesOrder = await SalesOrdersModule.deleteSalesOrderById(
            salesOrder._id
        )
        const getSalesOrder = await SalesOrdersModule.getSalesOrderById(
            salesOrder._id
        )
        expect(deletedSalesOrder[0]).to.equal(200)
        expect(getSalesOrder[0]).to.equal(404)
    })

    it('Fail: using invalid ID', async () => {
        const deletedSalesOrder = await SalesOrdersModule.deleteSalesOrderById(
            'invalid-id'
        )

        expect(deletedSalesOrder[0]).to.equal(404)
        expect(deletedSalesOrder[1].message).to.equal('Not found.')
    })
})
