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
        const productRes = await ProductsModule.createProduct(testdata.product2)
        createdProduct = productRes[1]
    })

    it('Success: run as admin with correct data', async () => {
        const { token } = await login({
            email: testdata.admin1.email,
            password: testdata.admin1.password,
        })

        const res = await request(app)
            .post(`/api/v1/warehouses`)
            .send(testdata.warehouse1)
            .set('Authorization', token)

        expect(res.statusCode).to.equal(201)
        expect(res.body.warehouse.name).to.equal(testdata.warehouse1.name)
        expect(res.body.warehouse.products).to.deep.equal([])
    })

    it('Success: products fetched with warehouse', async () => {
        const { token } = await login({
            email: testdata.admin1.email,
            password: testdata.admin1.password,
        })

        const {
            body: { warehouse },
        } = await request(app)
            .post(`/api/v1/warehouses`)
            .send(testdata.warehouse1)
            .set('Authorization', token)

        await request(app)
            .put(`/api/v1/products/${createdProduct._id}/transfer-stock`)
            .send({
                transferFrom: 'store',
                transferTo: warehouse.id,
                amount: 10,
            })
            .set('Authorization', token)

        const res = await request(app)
            .get(`/api/v1/warehouses/${warehouse.id}`)
            .set('Authorization', token)

        expect(res.statusCode).to.equal(200)
        expect(res.body.warehouse.name).to.equal(testdata.warehouse1.name)
        expect(res.body.warehouse.products[0].source.id.toString()).to.equal(
            createdProduct._id.toString()
        )
        expect(res.body.warehouse.products[0].stock).to.equal(10)
    })

    it('Fail: run as admin with incorrect data', async () => {
        const { token } = await login({
            email: testdata.admin1.email,
            password: testdata.admin1.password,
        })

        const res = await request(app)
            .post(`/api/v1/warehouses`)
            .send({})
            .set('Authorization', token)

        expect(res.statusCode).to.equal(400)
        expect(Object.keys(res.body.errors)).to.deep.equalInAnyOrder(['name'])
    })

    it('Fail: run as employee', async () => {
        const { token } = await login({
            email: testdata.employee1.email,
            password: testdata.employee1.password,
        })

        const res = await request(app)
            .post('/api/v1/warehouses')
            .send({})
            .set('Authorization', token)

        expect(res.statusCode).to.equal(401)
        expect(res.body).to.deep.equal({
            message: 'Unauthorized.',
        })
    })

    it('Fail: run as unauthorized', async () => {
        const res = await request(app).post('/api/v1/warehouses').send({})

        expect(res.statusCode).to.equal(401)
        expect(res.body).to.deep.equal({
            message: 'Unauthorized.',
        })
    })
})

describe('Delete warehouse', () => {
    const createdWarehouses = {}
    setup()
    beforeEach(async () => {
        await UsersModule.createUser(testdata.admin1)
        await UsersModule.createUser(testdata.employee1)
        const warehouse1Res = await WarehousesModule.createWarehouse(
            testdata.warehouse1
        )
        const warehouse2Res = await WarehousesModule.createWarehouse(
            testdata.warehouse2
        )
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
