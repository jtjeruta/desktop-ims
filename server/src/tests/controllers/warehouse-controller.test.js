const { expect, use } = require('chai')
const request = require('supertest')
const deepEqualInAnyOrder = require('deep-equal-in-any-order')

const setup = require('../setup')
const app = require('../../app')
const UsersModule = require('../../modules/users-module')
const ProductsModule = require('../../modules/products-module')
const WarehousesModule = require('../../modules/warehouses-module')
const { login } = require('../helpers')
const testdata = require('../testdata')

use(deepEqualInAnyOrder)

describe('Create warehouse', () => {
    let createdProduct = null
    setup()
    beforeEach(async () => {
        await UsersModule.createUser(testdata.admin1)
        await UsersModule.createUser(testdata.employee1)
        const productRes = await ProductsModule.createProduct(testdata.product1)
        createdProduct = productRes[1]
    })

    it('Success: run as admin with correct data', (done) => {
        login({
            email: testdata.admin1.email,
            password: testdata.admin1.password,
        }).then(({ token }) => {
            request(app)
                .post(`/api/v1/products/${createdProduct._id}/warehouses`)
                .send(testdata.warehouse1)
                .set('Authorization', token)
                .then((res) => {
                    expect(res.statusCode).to.equal(201)
                    expect(res.body.warehouse.name).to.equal(
                        testdata.warehouse1.name
                    )
                    expect(res.body.warehouse.quantity).to.equal(
                        testdata.warehouse1.quantity
                    )
                    done()
                })
                .catch((err) => done(err))
        })
    })

    it('Success: warehouses fetched along with product', async () => {
        const { token } = await login({
            email: testdata.admin1.email,
            password: testdata.admin1.password,
        })

        await request(app)
            .post(`/api/v1/products/${createdProduct._id}/warehouses`)
            .send(testdata.warehouse1)
            .set('Authorization', token)

        const res = await request(app)
            .get(`/api/v1/products/${createdProduct._id}`)
            .set('Authorization', token)

        expect(res.statusCode).to.equal(200)
        expect(res.body.product.warehouses.length).to.equal(1)
        expect(res.body.product.warehouses[0].name).to.equal(
            testdata.warehouse1.name
        )
        expect(res.body.product.warehouses[0].quantity).to.equal(
            testdata.warehouse1.quantity
        )
    })

    it('Fail: run as admin with incorrect data', (done) => {
        login({
            email: testdata.admin1.email,
            password: testdata.admin1.password,
        }).then(({ token }) => {
            request(app)
                .post(`/api/v1/products/${createdProduct._id}/warehouses`)
                .send({})
                .set('Authorization', token)
                .then((res) => {
                    expect(res.statusCode).to.equal(400)
                    expect(
                        Object.keys(res.body.errors)
                    ).to.deep.equalInAnyOrder(['name', 'quantity'])
                    done()
                })
                .catch((err) => done(err))
        })
    })

    it('Fail: run as employee', (done) => {
        login({
            email: testdata.employee1.email,
            password: testdata.employee1.password,
        }).then(({ token }) => {
            request(app)
                .post(`/api/v1/products/${createdProduct._id}/warehouses`)
                .send({})
                .set('Authorization', token)
                .then((res) => {
                    expect(res.statusCode).to.equal(401)
                    expect(res.body).to.deep.equal({
                        message: 'Unauthorized.',
                    })
                    done()
                })
                .catch((err) => done(err))
        })
    })

    it('Fail: run as unauthorized', (done) => {
        request(app)
            .post(`/api/v1/products/${createdProduct._id}/warehouses`)
            .then((res) => {
                expect(res.statusCode).to.equal(401)
                expect(res.body).to.deep.equal({
                    message: 'Unauthorized.',
                })
                done()
            })
            .catch((err) => done(err))
    })
})

describe('Delete warehouse', () => {
    const createdWarehouses = {}
    setup()
    beforeEach(async () => {
        await UsersModule.createUser(testdata.admin1)
        await UsersModule.createUser(testdata.employee1)
        const productRes = await ProductsModule.createProduct(testdata.product1)
        const warehouse1Res = await WarehousesModule.createWarehouse({
            ...testdata.warehouse1,
            product: productRes[1]._id,
        })
        const warehouse2Res = await WarehousesModule.createWarehouse({
            ...testdata.warehouse2,
            product: productRes[1]._id,
        })
        await ProductsModule.updateProduct(productRes[1]._id, {
            warehouses: [warehouse1Res[1]._id, warehouse2Res[1]._id],
        })
        createdWarehouses.warehouse1 = warehouse1Res[1]
        createdWarehouses.warehouse2 = warehouse2Res[1]
    })

    it('Success: run as admin', async () => {
        const { token } = await login({
            email: testdata.admin1.email,
            password: testdata.admin1.password,
        })

        const res = await request(app)
            .delete(`/api/v1/warehouses/${createdWarehouses.warehouse1._id}`)
            .set('Authorization', token)

        expect(res.statusCode).to.equal(200)
        expect(res.body).to.deep.equal({ message: 'Warehouse deleted.' })
    })

    it('Success: warehouse is deleted from product object as well', async () => {
        const { token } = await login({
            email: testdata.admin1.email,
            password: testdata.admin1.password,
        })

        await request(app)
            .delete(`/api/v1/warehouses/${createdWarehouses.warehouse1._id}`)
            .set('Authorization', token)

        const res = await request(app)
            .get(`/api/v1/products/${createdWarehouses.warehouse1.product}`)
            .set('Authorization', token)

        expect(res.statusCode).to.equal(200)
        expect(res.body.product.warehouses.length).to.equal(1)
    })

    it('Fail: run as employee', (done) => {
        login({
            email: testdata.employee1.email,
            password: testdata.employee1.password,
        }).then(({ token }) => {
            request(app)
                .delete(
                    `/api/v1/warehouses/${createdWarehouses.warehouse1._id}`
                )
                .set('Authorization', token)
                .then((res) => {
                    expect(res.statusCode).to.equal(401)
                    expect(res.body).to.deep.equal({
                        message: 'Unauthorized.',
                    })
                    done()
                })
                .catch((err) => done(err))
        })
    })

    it('Fail: run as unauthorized', (done) => {
        request(app)
            .delete(`/api/v1/warehouses/${createdWarehouses.warehouse1._id}`)
            .then((res) => {
                expect(res.statusCode).to.equal(401)
                expect(res.body).to.deep.equal({
                    message: 'Unauthorized.',
                })
                done()
            })
            .catch((err) => done(err))
    })
})
