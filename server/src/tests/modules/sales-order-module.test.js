const { expect } = require('chai')
const moment = require('moment')

const SalesOrdersModule = require('../../modules/sales-orders-module')
const ProductsModule = require('../../modules/products-module')
const CustomersModule = require('../../modules/customers-module')
const setup = require('../setup')
const testdata = require('../testdata')

describe('Module: Create Sales Order', () => {
    setup()
    let product = null
    let customer = null

    beforeEach(async () => {
        product = (await ProductsModule.createProduct(testdata.product1))[1]
        customer = (await CustomersModule.createCustomer(testdata.customer1))[1]
    })

    it('Success: using correct data', async () => {
        const createdSalesOrder = await SalesOrdersModule.createSalesOrder({
            products: [
                {
                    id: 'test_product_1',
                    product: product._id,
                    quantity: 100,
                    itemPrice: 10,
                },
            ],
            customer: customer._id,
            orderDate: 12345,
        })

        expect(createdSalesOrder[0]).to.equal(201)
        expect(createdSalesOrder[1].products[0].totalPrice).to.equal(1000)
        expect(createdSalesOrder[1].orderDate).to.equal(12345)
        expect(createdSalesOrder[1].total).to.equal(1000)
    })

    it('Fail: using invalid data', async () => {
        const createdSalesOrder = await SalesOrdersModule.createSalesOrder({
            orderDate: moment(),
        })

        expect(createdSalesOrder[0]).to.equal(400)
        expect(createdSalesOrder[1].errors.customer.message).to.equal(
            'Path `customer` is required.'
        )
        expect(createdSalesOrder[1].errors.products.message).to.equal(
            'Path `products` must contain atleast 1.'
        )
    })
})

describe('Module: List SalesOrders', () => {
    setup()

    it('Success: list all sales orders', async () => {
        product = (await ProductsModule.createProduct(testdata.product1))[1]
        customer = (await CustomersModule.createCustomer(testdata.customer1))[1]

        await SalesOrdersModule.createSalesOrder({
            products: [
                {
                    id: 'test_product_1',
                    product: product._id,
                    quantity: 100,
                    itemPrice: 10,
                },
            ],
            customer: customer._id,
            orderDate: 12345,
        })

        const salesOrders = await SalesOrdersModule.listSalesOrders()
        expect(salesOrders[0]).to.equal(200)
        expect(salesOrders[1].length).to.equal(1)
        expect(salesOrders[1][0].customer.name).to.equal(
            testdata.customer1.name
        )
        expect(salesOrders[1][0].orderDate).to.equal(12345)
        expect(salesOrders[1][0].products[0].product.name).to.equal(
            testdata.product1.name
        )
    })
})

describe('Module: Get SalesOrder by id', () => {
    setup()

    let product, customer, salesOrder

    beforeEach(async () => {
        product = (await ProductsModule.createProduct(testdata.product1))[1]
        customer = (await CustomersModule.createCustomer(testdata.customer1))[1]

        salesOrder = (
            await SalesOrdersModule.createSalesOrder({
                products: [
                    {
                        id: 'test_product_1',
                        product: product._id,
                        quantity: 100,
                        itemPrice: 10,
                    },
                ],
                customer: customer._id,
                orderDate: 12345,
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

    let product1, product2, customer, salesOrder

    beforeEach(async () => {
        product1 = (await ProductsModule.createProduct(testdata.product1))[1]
        product2 = (await ProductsModule.createProduct(testdata.product2))[1]
        customer = (await CustomersModule.createCustomer(testdata.customer1))[1]

        salesOrder = (
            await SalesOrdersModule.createSalesOrder({
                products: [
                    {
                        id: 'test_product_1',
                        product: product1._id,
                        quantity: 100,
                        itemPrice: 10,
                    },
                ],
                customer: customer._id,
                orderDate: 12345,
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
                    },
                ],
                orderDate: 54321,
            }
        )

        expect(updatedSalesOrder[0]).to.equal(200)
        expect(updatedSalesOrder[1].products.length).to.equal(2)
        expect(updatedSalesOrder[1].orderDate).to.equal(54321)
        expect(updatedSalesOrder[1].total).to.equal(5000)
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
        expect(updatedSalesOrder[1].errors.customer.message).to.equal(
            'Path `customer` is required.'
        )
        expect(updatedSalesOrder[1].errors.products.message).to.equal(
            'Path `products` must contain atleast 1.'
        )
    })
})
