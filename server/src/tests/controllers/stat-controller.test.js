const { expect } = require('chai')
const request = require('supertest')

const setup = require('../setup')
const app = require('../../app')
const { login } = require('../helpers')
const testdata = require('../testdata')
const UsersModule = require('../../modules/users-module')
const ProductsModule = require('../../modules/products-module')
const { calculateAverageCost } = require('../../controllers/stat-controller')

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

describe('Controller: calculate average cost', () => {
    it('should calculate average cost correctly', () => {
        const currentQty = 500
        const currentCost = 500
        const purchases = [
            { qty: 10, cost: 550 },
            { qty: 20, cost: 600 },
            { qty: 30, cost: 650 },
        ]

        const aveCost = calculateAverageCost(currentQty, currentCost, purchases)

        expect(aveCost).to.be.closeTo(512.5, 0.01)
    })

    it('should return current cost if no purchases are made', () => {
        const currentQty = 500
        const currentCost = 500
        const purchases = []

        const aveCost = calculateAverageCost(currentQty, currentCost, purchases)

        expect(aveCost).to.equal(currentCost)
    })

    it('should return purchase cost if only one purchase is made', () => {
        const currentQty = 0
        const currentCost = 0
        const purchases = [{ qty: 10, cost: 550 }]

        const aveCost = calculateAverageCost(currentQty, currentCost, purchases)

        expect(aveCost).to.equal(550)
    })

    it('should handle purchases with zero quantity', () => {
        const currentQty = 500
        const currentCost = 500
        const purchases = [
            { qty: 0, cost: 0 },
            { qty: 20, cost: 600 },
            { qty: 30, cost: 650 },
        ]

        // ((500 * 500) + (0 * 0) + (20 * 600) + (30 * 650)) / (500 + 0 + 20 + 30)
        // (250000 + 0 + 12000 + 19500) / 550
        // 281500 / 550
        // 511.8181

        const aveCost = calculateAverageCost(currentQty, currentCost, purchases)

        expect(aveCost).to.be.closeTo(511.81, 0.01)
    })
})
