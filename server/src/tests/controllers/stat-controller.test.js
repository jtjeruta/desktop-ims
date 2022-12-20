const { expect } = require('chai')
const request = require('supertest')

const setup = require('../setup')
const app = require('../../app')
const { login } = require('../helpers')
const testdata = require('../testdata')
const UsersModule = require('../../modules/users-module')
const ProductsModule = require('../../modules/products-module')

describe('Controller: get total product sales', () => {
    setup()

    beforeEach(async () => {
        await UsersModule.createUser(testdata.admin1)
        await UsersModule.createUser(testdata.employee1)
    })

    it('Success run as admin', async () => {
        const { token } = await login({
            email: testdata.admin1.email,
            password: testdata.admin1.password,
        })

        const res = await request(app)
            .get('/api/v1/stats/total-product-sales')
            .set('Authorization', token)

        expect(res.statusCode).to.equal(200)
    })
})

describe('Controller: get total product purchases', () => {
    setup()

    beforeEach(async () => {
        await UsersModule.createUser(testdata.admin1)
        await UsersModule.createUser(testdata.employee1)
    })

    it('Success run as admin', async () => {
        const { token } = await login({
            email: testdata.admin1.email,
            password: testdata.admin1.password,
        })

        const res = await request(app)
            .get('/api/v1/stats/total-product-purchases')
            .set('Authorization', token)

        expect(res.statusCode).to.equal(200)
    })
})

describe('Controller: list product reports', () => {
    setup()
    const data = {}

    beforeEach(async () => {
        await UsersModule.createUser(testdata.admin1)
        await UsersModule.createUser(testdata.employee1)
        data.product1 = (
            await ProductsModule.createProduct(testdata.product1)
        )[1]
    })

    it('Success run as admin', async () => {
        const { token } = await login({
            email: testdata.admin1.email,
            password: testdata.admin1.password,
        })

        const res = await request(app)
            .get('/api/v1/stats/product-reports')
            .set('Authorization', token)

        expect(res.statusCode).to.equal(200)
    })
})
