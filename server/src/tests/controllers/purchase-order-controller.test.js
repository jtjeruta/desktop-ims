const { expect, use } = require('chai')
const request = require('supertest')
const deepEqualInAnyOrder = require('deep-equal-in-any-order')

const setup = require('../setup')
const app = require('../../app')
const UsersModule = require('../../modules/users-module')
const ProductsModule = require('../../modules/products-module')
const PurchaseOrdersModule = require('../../modules/purchase-orders-module')
const VendorsModule = require('../../modules/vendors-module')
const { login } = require('../helpers')
const testdata = require('../testdata')

use(deepEqualInAnyOrder)

describe('Controller: List purchase orders', () => {
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
                },
            ],
            vendor: vendor._id,
        })

        await PurchaseOrdersModule.createPurchaseOrder({
            products: [
                {
                    id: 'test_product_2',
                    product: product._id,
                    quantity: 100,
                    itemPrice: 10,
                },
            ],
            vendor: vendor._id,
        })
    })

    it('Success: run as admin', async () => {
        const { token } = await login({
            email: testdata.admin1.email,
            password: testdata.admin1.password,
        })

        const res = await request(app)
            .get('/api/v1/purchase-orders')
            .set('Authorization', token)

        expect(res.statusCode).to.equal(200)
        expect(res.body.orders.length).to.equal(2)
    })

    it('Success: run as employee', async () => {
        const { token } = await login({
            email: testdata.employee1.email,
            password: testdata.employee1.password,
        })

        const res = await request(app)
            .get('/api/v1/purchase-orders')
            .set('Authorization', token)

        expect(res.statusCode).to.equal(401)
        expect(res.body).to.deep.equal({
            message: 'Unauthorized.',
        })
    })

    it('Fail: run as unauthorized', async () => {
        const res = await request(app).get('/api/v1/purchase-orders')

        expect(res.statusCode).to.equal(401)
        expect(res.body).to.deep.equal({
            message: 'Unauthorized.',
        })
    })
})

describe('Controller: Get purchase order', () => {
    setup()
    let purchaseOrder = null

    beforeEach(async () => {
        await UsersModule.createUser(testdata.admin1)
        await UsersModule.createUser(testdata.employee1)

        const product = (
            await ProductsModule.createProduct(testdata.product1)
        )[1]
        const vendor = (await VendorsModule.createVendor(testdata.vendor1))[1]

        purchaseOrder = (
            await PurchaseOrdersModule.createPurchaseOrder({
                products: [
                    {
                        id: 'test_product_1',
                        product: product._id,
                        quantity: 100,
                        itemPrice: 10,
                    },
                ],
                vendor: vendor._id,
            })
        )[1]
    })

    it('Success: run as admin', async () => {
        const { token } = await login({
            email: testdata.admin1.email,
            password: testdata.admin1.password,
        })

        const res = await request(app)
            .get(`/api/v1/purchase-orders/${purchaseOrder._id}`)
            .set('Authorization', token)

        expect(res.statusCode).to.equal(200)
        expect('id' in res.body.order).to.be.true
    })

    it('Success: run as employee', async () => {
        const { token } = await login({
            email: testdata.employee1.email,
            password: testdata.employee1.password,
        })

        const res = await request(app)
            .get(`/api/v1/purchase-orders/${purchaseOrder._id}`)
            .set('Authorization', token)

        expect(res.statusCode).to.equal(401)
        expect(res.body).to.deep.equal({
            message: 'Unauthorized.',
        })
    })

    it('Fail: run as unauthorized', async () => {
        const res = await request(app).get(
            `/api/v1/purchase-orders/${purchaseOrder._id}`
        )

        expect(res.statusCode).to.equal(401)
        expect(res.body).to.deep.equal({
            message: 'Unauthorized.',
        })
    })
})

describe('Controller: Create purchase order', () => {
    setup()
    let product, vendor

    beforeEach(async () => {
        await UsersModule.createUser(testdata.admin1)
        await UsersModule.createUser(testdata.employee1)
        product = (await ProductsModule.createProduct(testdata.product1))[1]
        vendor = (await VendorsModule.createVendor(testdata.vendor1))[1]
    })

    it('Success: run as admin with correct data', async () => {
        const { token } = await login({
            email: testdata.admin1.email,
            password: testdata.admin1.password,
        })

        const res = await request(app)
            .post('/api/v1/purchase-orders')
            .send({
                vendor: vendor._id,
                products: [
                    {
                        id: 'test_product_1',
                        product: product._id,
                        quantity: 5,
                        itemPrice: 10,
                    },
                ],
            })
            .set('Authorization', token)

        expect(res.statusCode).to.equal(201)
        expect(res.body.order.vendor.id).to.equal(vendor._id.toString())
        expect(res.body.order.products[0].product.id).to.equal(
            product._id.toString()
        )
        expect(res.body.order.products[0].totalPrice).to.equal(50)
        expect(res.body.order.total).to.equal(50)
    })

    it('Fail: run as admin with incorrect data', async () => {
        const { token } = await login({
            email: testdata.admin1.email,
            password: testdata.admin1.password,
        })

        const res = await request(app)
            .post('/api/v1/purchase-orders')
            .send({ vendor: vendor._id })
            .set('Authorization', token)

        expect(res.statusCode).to.equal(400)
        expect(res.body.errors.products.message).to.equal(
            'Path `products` must contain atleast 1.'
        )
    })

    it('Fail: run as employee', async () => {
        const { token } = await login({
            email: testdata.employee1.email,
            password: testdata.employee1.password,
        })

        const res = await request(app)
            .post('/api/v1/purchase-orders')
            .send({})
            .set('Authorization', token)

        expect(res.statusCode).to.equal(401)
        expect(res.body).to.deep.equal({
            message: 'Unauthorized.',
        })
    })

    it('Fail: run as unauthorized', async () => {
        const res = await request(app).post('/api/v1/purchase-orders')

        expect(res.statusCode).to.equal(401)
        expect(res.body).to.deep.equal({
            message: 'Unauthorized.',
        })
    })
})

describe('Controller: Update purchase order', () => {
    setup()
    let product, vendor, purchaseOrder

    beforeEach(async () => {
        await UsersModule.createUser(testdata.admin1)
        await UsersModule.createUser(testdata.employee1)

        product = (await ProductsModule.createProduct(testdata.product1))[1]
        vendor = (await VendorsModule.createVendor(testdata.vendor1))[1]

        purchaseOrder = (
            await PurchaseOrdersModule.createPurchaseOrder({
                products: [
                    {
                        id: 'test_product_1',
                        product: product._id,
                        quantity: 100,
                        itemPrice: 10,
                    },
                ],
                vendor: vendor._id,
            })
        )[1]
    })

    it('Success: run as admin with correct data', async () => {
        const { token } = await login({
            email: testdata.admin1.email,
            password: testdata.admin1.password,
        })

        const res = await request(app)
            .put(`/api/v1/purchase-orders/${purchaseOrder._id}`)
            .send({
                products: [
                    {
                        id: 'test_product_1',
                        product: product._id,
                        quantity: 100,
                        itemPrice: 10,
                    },
                ],
            })
            .set('Authorization', token)

        expect(res.statusCode).to.equal(200)
        expect(res.body.order.vendor.id).to.equal(vendor._id.toString())
        expect(res.body.order.products[0].product.id).to.equal(
            product._id.toString()
        )
        expect(res.body.order.products[0].totalPrice).to.equal(1000)
        expect(res.body.order.total).to.equal(1000)
    })

    it('Fail: run as admin with incorrect data', async () => {
        const { token } = await login({
            email: testdata.admin1.email,
            password: testdata.admin1.password,
        })

        const res = await request(app)
            .post('/api/v1/purchase-orders')
            .send({ vendor: vendor._id })
            .set('Authorization', token)

        expect(res.statusCode).to.equal(400)
        expect(res.body.errors.products.message).to.equal(
            'Path `products` must contain atleast 1.'
        )
    })

    it('Fail: run as employee', async () => {
        const { token } = await login({
            email: testdata.employee1.email,
            password: testdata.employee1.password,
        })

        const res = await request(app)
            .post('/api/v1/purchase-orders')
            .send({})
            .set('Authorization', token)

        expect(res.statusCode).to.equal(401)
        expect(res.body).to.deep.equal({
            message: 'Unauthorized.',
        })
    })

    it('Fail: run as unauthorized', async () => {
        const res = await request(app).post('/api/v1/purchase-orders')

        expect(res.statusCode).to.equal(401)
        expect(res.body).to.deep.equal({
            message: 'Unauthorized.',
        })
    })
})
