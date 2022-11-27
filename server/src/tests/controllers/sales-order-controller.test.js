const { expect, use } = require('chai')
const request = require('supertest')
const deepEqualInAnyOrder = require('deep-equal-in-any-order')
const moment = require('moment')

const setup = require('../setup')
const app = require('../../app')
const UsersModule = require('../../modules/users-module')
const ProductsModule = require('../../modules/products-module')
const SalesOrdersModule = require('../../modules/sales-orders-module')
const CustomersModule = require('../../modules/customers-module')
const WarehousesModule = require('../../modules/warehouses-module')
const { login } = require('../helpers')
const testdata = require('../testdata')

use(deepEqualInAnyOrder)

describe('Controller: List sales orders', () => {
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
        const warehouse = (
            await WarehousesModule.createWarehouse({
                ...testdata.warehouse1,
                product: product._id,
            })
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
                    warehouse,
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
    })

    it('Success: run as admin', async () => {
        const { token } = await login({
            email: testdata.admin1.email,
            password: testdata.admin1.password,
        })

        const res = await request(app)
            .get('/api/v1/sales-orders')
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
            .get('/api/v1/sales-orders')
            .set('Authorization', token)

        expect(res.statusCode).to.equal(401)
        expect(res.body).to.deep.equal({
            message: 'Unauthorized.',
        })
    })

    it('Fail: run as unauthorized', async () => {
        const res = await request(app).get('/api/v1/sales-orders')

        expect(res.statusCode).to.equal(401)
        expect(res.body).to.deep.equal({
            message: 'Unauthorized.',
        })
    })
})

describe('Controller: Get sales order', () => {
    setup()
    let salesOrder = null

    beforeEach(async () => {
        await UsersModule.createUser(testdata.admin1)
        await UsersModule.createUser(testdata.employee1)

        const product = (
            await ProductsModule.createProduct(testdata.product1)
        )[1]
        const customer = (
            await CustomersModule.createCustomer(testdata.customer1)
        )[1]
        const warehouse = (
            await WarehousesModule.createWarehouse({
                ...testdata.warehouse1,
                product: product._id,
            })
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
            .get(`/api/v1/sales-orders/${salesOrder._id}`)
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
            .get(`/api/v1/sales-orders/${salesOrder._id}`)
            .set('Authorization', token)

        expect(res.statusCode).to.equal(401)
        expect(res.body).to.deep.equal({
            message: 'Unauthorized.',
        })
    })

    it('Fail: run as unauthorized', async () => {
        const res = await request(app).get(
            `/api/v1/sales-orders/${salesOrder._id}`
        )

        expect(res.statusCode).to.equal(401)
        expect(res.body).to.deep.equal({
            message: 'Unauthorized.',
        })
    })
})

describe('Controller: Create sales order', () => {
    setup()
    let product, customer, warehouse

    beforeEach(async () => {
        await UsersModule.createUser(testdata.admin1)
        await UsersModule.createUser(testdata.employee1)
        product = (await ProductsModule.createProduct(testdata.product1))[1]
        customer = (await CustomersModule.createCustomer(testdata.customer1))[1]
        warehouse = (
            await WarehousesModule.createWarehouse({
                ...testdata.warehouse1,
                product: product._id,
            })
        )[1]
    })

    it('Success: run as admin with correct data', async () => {
        const { token } = await login({
            email: testdata.admin1.email,
            password: testdata.admin1.password,
        })

        const res = await request(app)
            .post('/api/v1/sales-orders')
            .send({
                customer: customer._id,
                products: [
                    {
                        id: 'test_product_1',
                        product: product._id,
                        quantity: 5,
                        itemPrice: 10,
                        warehouse,
                        variant: {
                            name: 'Test Variant',
                            quantity: 10,
                        },
                    },
                ],
                invoiceNumber: 'invoice-number-1',
            })
            .set('Authorization', token)

        expect(res.statusCode).to.equal(201)
        expect(res.body.order.customer.id).to.equal(customer._id.toString())
        expect(res.body.order.products[0].product.id).to.equal(
            product._id.toString()
        )
        expect(res.body.order.products[0].totalPrice).to.equal(500)
        expect(res.body.order.total).to.equal(500)

        const updatedWarehouse = (
            await WarehousesModule.getWarehouseById(warehouse)
        )[1]

        expect(updatedWarehouse.quantity).to.equal(-40)
    })

    it('Fail: run as admin with incorrect data', async () => {
        const { token } = await login({
            email: testdata.admin1.email,
            password: testdata.admin1.password,
        })

        const res = await request(app)
            .post('/api/v1/sales-orders')
            .send({ customer: customer._id })
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
            .post('/api/v1/sales-orders')
            .send({})
            .set('Authorization', token)

        expect(res.statusCode).to.equal(401)
        expect(res.body).to.deep.equal({
            message: 'Unauthorized.',
        })
    })

    it('Fail: run as unauthorized', async () => {
        const res = await request(app).post('/api/v1/sales-orders')

        expect(res.statusCode).to.equal(401)
        expect(res.body).to.deep.equal({
            message: 'Unauthorized.',
        })
    })
})

describe('Controller: Update sales order', () => {
    setup()
    let product, customer, salesOrder, warehouse

    beforeEach(async () => {
        await UsersModule.createUser(testdata.admin1)
        await UsersModule.createUser(testdata.employee1)

        product = (await ProductsModule.createProduct(testdata.product1))[1]
        customer = (await CustomersModule.createCustomer(testdata.customer1))[1]
        warehouse = (
            await WarehousesModule.createWarehouse({
                ...testdata.warehouse1,
                product: product._id,
            })
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
            .put(`/api/v1/sales-orders/${salesOrder._id}`)
            .send({
                products: [
                    {
                        id: 'test_product_1',
                        product: product._id,
                        quantity: 100,
                        itemPrice: 10,
                        warehouse,
                        variant: {
                            name: 'Test Variant',
                            quantity: 5,
                        },
                    },
                ],
                invoiceNumber: 'invoice-number-1',
            })
            .set('Authorization', token)

        expect(res.statusCode).to.equal(200)
        expect(res.body.order.customer.id).to.equal(customer._id.toString())
        expect(res.body.order.products[0].product.id).to.equal(
            product._id.toString()
        )
        expect(res.body.order.products[0].totalPrice).to.equal(5000)
        expect(res.body.order.total).to.equal(5000)

        const updatedWarehouse = (
            await WarehousesModule.getWarehouseById(warehouse)
        )[1]

        expect(updatedWarehouse.quantity).to.equal(-490)
    })

    it('Fail: run as admin with incorrect data', async () => {
        const { token } = await login({
            email: testdata.admin1.email,
            password: testdata.admin1.password,
        })

        const res = await request(app)
            .post('/api/v1/sales-orders')
            .send({ customer: customer._id })
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
            .post('/api/v1/sales-orders')
            .send({})
            .set('Authorization', token)

        expect(res.statusCode).to.equal(401)
        expect(res.body).to.deep.equal({
            message: 'Unauthorized.',
        })
    })

    it('Fail: run as unauthorized', async () => {
        const res = await request(app).post('/api/v1/sales-orders')

        expect(res.statusCode).to.equal(401)
        expect(res.body).to.deep.equal({
            message: 'Unauthorized.',
        })
    })
})
