const { expect, use } = require('chai')
const request = require('supertest')
const deepEqualInAnyOrder = require('deep-equal-in-any-order')
const moment = require('moment')

const setup = require('../setup')
const app = require('../../app')
const UsersModule = require('../../modules/users-module')
const ProductsModule = require('../../modules/products-module')
const PurchaseOrdersModule = require('../../modules/purchase-orders-module')
const VendorsModule = require('../../modules/vendors-module')
const WarehousesModule = require('../../modules/warehouses-module')
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
        const warehouse = (
            await WarehousesModule.createWarehouse(testdata.warehouse1)
        )[1]

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
                    warehouse,
                    variant: {
                        name: 'Test Variant',
                        quantity: 10,
                    },
                },
            ],
            vendor: vendor._id,
            orderDate: moment().unix(),
            invoiceNumber: 'invoice-number-2',
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
        const warehouse = (
            await WarehousesModule.createWarehouse(testdata.warehouse1)
        )[1]

        purchaseOrder = (
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
                orderDate: moment().unix(),
                invoiceNumber: 'invoice-number-1',
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
    let product, vendor, warehouse
    setup()

    beforeEach(async () => {
        await UsersModule.createUser(testdata.admin1)
        await UsersModule.createUser(testdata.employee1)
        product = (await ProductsModule.createProduct(testdata.product1))[1]
        vendor = (await VendorsModule.createVendor(testdata.vendor1))[1]
        warehouse = (
            await WarehousesModule.createWarehouse(testdata.warehouse1)
        )[1]
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
                        variant: {
                            name: 'Test Variant',
                            quantity: 10,
                        },
                        warehouse,
                    },
                ],
                orderDate: moment().unix(),
                invoiceNumber: 'invoice-number-1',
            })
            .set('Authorization', token)

        expect(res.statusCode).to.equal(201)
        expect(res.body.order.vendor.id).to.equal(vendor._id.toString())
        expect(res.body.order.products[0].product.id).to.equal(
            product._id.toString()
        )
        expect(res.body.order.products[0].totalPrice).to.equal(500)
        expect(res.body.order.total).to.equal(500)

        const updatedWarehouse = (
            await WarehousesModule.getWarehouseById(warehouse)
        )[1]

        expect(updatedWarehouse.products[0].stock).to.equal(50)
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
    let product, vendor, purchaseOrder
    setup()

    beforeEach(async () => {
        await UsersModule.createUser(testdata.admin1)
        await UsersModule.createUser(testdata.employee1)

        product = (await ProductsModule.createProduct(testdata.product1))[1]
        vendor = (await VendorsModule.createVendor(testdata.vendor1))[1]
        warehouse = (
            await WarehousesModule.createWarehouse({
                ...testdata.warehouse1,
                products: [{ source: product._id, stock: 1000 }],
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
                        warehouse,
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
                        quantity: 50,
                        itemPrice: 10,
                        warehouse,
                        variant: {
                            name: 'Test Variant',
                            quantity: 5,
                        },
                    },
                ],
                orderDate: moment().unix(),
                invoiceNumber: 'invoice-number-1',
            })
            .set('Authorization', token)

        expect(res.statusCode).to.equal(200)
        expect(res.body.order.vendor.id).to.equal(vendor._id.toString())
        expect(res.body.order.products[0].product.id).to.equal(
            product._id.toString()
        )
        expect(res.body.order.products[0].totalPrice).to.equal(2500)
        expect(res.body.order.total).to.equal(2500)

        // warehouse should have its stock diminished
        const updatedWarehouse = (
            await WarehousesModule.getWarehouseById(warehouse)
        )[1]

        expect(updatedWarehouse.products[0].stock).to.equal(250)
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
