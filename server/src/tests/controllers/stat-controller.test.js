const { expect, use } = require('chai')
const request = require('supertest')
const deepEqualInAnyOrder = require('deep-equal-in-any-order')
const moment = require('moment')

const setup = require('../setup')
const app = require('../../app')
const UsersModule = require('../../modules/users-module')
const ProductsModule = require('../../modules/products-module')
const SalesOrdersModule = require('../../modules/sales-orders-module')
const PurchaseOrdersModule = require('../../modules/purchase-orders-module')
const CustomersModule = require('../../modules/customers-module')
const VendorsModule = require('../../modules/vendors-module')
const { login } = require('../helpers')
const testdata = require('../testdata')

use(deepEqualInAnyOrder)

describe('Controller: Get top product sales by date range', () => {
    setup()

    beforeEach(async () => {
        await UsersModule.createUser(testdata.admin1)
        await UsersModule.createUser(testdata.employee1)

        const product = (
            await ProductsModule.createProduct(testdata.product1)
        )[1]
        const customer = (
            await CustomersModule.createCustomer(testdata.customer1)
        )[1]

        await SalesOrdersModule.createSalesOrder({
            products: [
                {
                    id: 'test_product_1',
                    product: product._id,
                    quantity: 100,
                    itemPrice: 10,
                    variant: {
                        name: 'Test Variant',
                        quantity: 10,
                    },
                },
            ],
            customer: customer._id,
            orderDate: moment().unix(),
            invoiceNumber: 'invoice-number-1',
        })

        await SalesOrdersModule.createSalesOrder({
            products: [
                {
                    id: 'test_product_2',
                    product: product._id,
                    quantity: 100,
                    itemPrice: 10,
                    variant: {
                        name: 'Test Variant',
                        quantity: 10,
                    },
                },
            ],
            customer: customer._id,
            orderDate: moment().subtract(1, 'month').unix(),
            invoiceNumber: 'invoice-number-1',
        })
    })

    it('Success: get top products for the month', async () => {
        const { token } = await login({
            email: testdata.admin1.email,
            password: testdata.admin1.password,
        })

        const startDate = moment().startOf('month').unix()
        const endDate = moment().endOf('day').unix()

        const res = await request(app)
            .get(
                `/api/v1/stats/top-product-sales?startDate=${startDate}&endDate=${endDate}`
            )
            .set('Authorization', token)

        expect(res.statusCode).to.equal(200)
        expect(res.body.products.length).to.equal(1)
        expect(res.body.products[0].quantity).to.equal(100)
        expect(res.body.products[0].total).to.equal(1000)
    })

    it('Success: get top products for the last 2 months', async () => {
        const { token } = await login({
            email: testdata.admin1.email,
            password: testdata.admin1.password,
        })

        const startDate = moment().subtract(1, 'month').startOf('month').unix()
        const endDate = moment().endOf('day').unix()

        const res = await request(app)
            .get(
                `/api/v1/stats/top-product-sales?startDate=${startDate}&endDate=${endDate}`
            )
            .set('Authorization', token)

        expect(res.statusCode).to.equal(200)
        expect(res.body.products.length).to.equal(1)
        expect(res.body.products[0].quantity).to.equal(200)
        expect(res.body.products[0].total).to.equal(2000)
    })

    it('Success: run as employee', async () => {
        const { token } = await login({
            email: testdata.employee1.email,
            password: testdata.employee1.password,
        })

        const res = await request(app)
            .get('/api/v1/stats/top-product-sales')
            .set('Authorization', token)

        expect(res.statusCode).to.equal(401)
        expect(res.body).to.deep.equal({
            message: 'Unauthorized.',
        })
    })

    it('Fail: run as unauthorized', async () => {
        const res = await request(app).get('/api/v1/stats/top-product-sales')

        expect(res.statusCode).to.equal(401)
        expect(res.body).to.deep.equal({
            message: 'Unauthorized.',
        })
    })
})

describe('Controller: Get top product purchases by date range', () => {
    setup()

    beforeEach(async () => {
        await UsersModule.createUser(testdata.admin1)
        await UsersModule.createUser(testdata.employee1)

        const product = (
            await ProductsModule.createProduct(testdata.product1)
        )[1]
        const vendor = (await VendorsModule.createVendor(testdata.vendor1))[1]

        await PurchaseOrdersModule.createPurchaseOrder({
            products: [
                {
                    id: 'test_product_1',
                    product: product._id,
                    quantity: 100,
                    itemPrice: 10,
                    variant: {
                        name: 'Test Variant',
                        quantity: 10,
                    },
                },
            ],
            vendor: vendor._id,
            orderDate: moment().unix(),
            invoiceNumber: 'invoice-number-1',
        })

        await PurchaseOrdersModule.createPurchaseOrder({
            products: [
                {
                    id: 'test_product_2',
                    product: product._id,
                    quantity: 100,
                    itemPrice: 10,
                    variant: {
                        name: 'Test Variant',
                        quantity: 10,
                    },
                },
            ],
            vendor: vendor._id,
            orderDate: moment().subtract(1, 'month').unix(),
            invoiceNumber: 'invoice-number-1',
        })
    })

    it('Success: get top products for the month', async () => {
        const { token } = await login({
            email: testdata.admin1.email,
            password: testdata.admin1.password,
        })

        const startDate = moment().startOf('month').unix()
        const endDate = moment().endOf('day').unix()

        const res = await request(app)
            .get(
                `/api/v1/stats/top-product-purchases?startDate=${startDate}&endDate=${endDate}`
            )
            .set('Authorization', token)

        expect(res.statusCode).to.equal(200)
        expect(res.body.products.length).to.equal(1)
        expect(res.body.products[0].quantity).to.equal(100)
        expect(res.body.products[0].total).to.equal(1000)
    })

    it('Success: get top products for the last 2 months', async () => {
        const { token } = await login({
            email: testdata.admin1.email,
            password: testdata.admin1.password,
        })

        const startDate = moment().subtract(1, 'month').startOf('month').unix()
        const endDate = moment().endOf('day').unix()

        const res = await request(app)
            .get(
                `/api/v1/stats/top-product-purchases?startDate=${startDate}&endDate=${endDate}`
            )
            .set('Authorization', token)

        expect(res.statusCode).to.equal(200)
        expect(res.body.products.length).to.equal(1)
        expect(res.body.products[0].quantity).to.equal(200)
        expect(res.body.products[0].total).to.equal(2000)
    })

    it('Success: run as employee', async () => {
        const { token } = await login({
            email: testdata.employee1.email,
            password: testdata.employee1.password,
        })

        const res = await request(app)
            .get('/api/v1/stats/top-product-purchases')
            .set('Authorization', token)

        expect(res.statusCode).to.equal(401)
        expect(res.body).to.deep.equal({
            message: 'Unauthorized.',
        })
    })

    it('Fail: run as unauthorized', async () => {
        const res = await request(app).get(
            '/api/v1/stats/top-product-purchases'
        )

        expect(res.statusCode).to.equal(401)
        expect(res.body).to.deep.equal({
            message: 'Unauthorized.',
        })
    })
})
