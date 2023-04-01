const { expect } = require('chai')
const request = require('supertest')

const setup = require('../setup')
const app = require('../../app')
const { login } = require('../helpers')
const testdata = require('../testdata')
const UsersModule = require('../../modules/users-module')
const ProductsModule = require('../../modules/products-module')
const {
    calculateAverageCost,
    calculateAverageSales,
} = require('../../controllers/stat-controller')

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
        const currentQty = 560
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
        const currentQty = 10
        const currentCost = 0
        const purchases = [{ qty: 10, cost: 550 }]

        const aveCost = calculateAverageCost(currentQty, currentCost, purchases)

        expect(aveCost).to.equal(550)
    })

    it('should handle purchases with zero quantity', () => {
        const currentQty = 550
        const currentCost = 500
        const purchases = [
            { qty: 0, cost: 0 },
            { qty: 20, cost: 600 },
            { qty: 30, cost: 650 },
        ]

        const aveCost = calculateAverageCost(currentQty, currentCost, purchases)

        expect(aveCost).to.be.closeTo(511.81, 0.01)
    })

    it('should return correct value down to the decimal', () => {
        const currentQty = 566
        const currentCost = 400
        const purchases = [{ qty: 120, cost: 420 }]

        const aveCost = calculateAverageCost(currentQty, currentCost, purchases)
        expect(aveCost).to.be.closeTo(404.24, 0.01)
    })
})

describe('Controller: calculate average sales', () => {
    it('should calculate average sales correctly', () => {
        const currentQty = 440
        const currentCost = 500
        const purchases = [
            { qty: 10, cost: 550 },
            { qty: 20, cost: 600 },
            { qty: 30, cost: 650 },
        ]

        const aveCost = calculateAverageSales(
            currentQty,
            currentCost,
            purchases
        )

        expect(aveCost).to.be.closeTo(512.5, 0.01)
    })

    it('should return current sales if no sales are made', () => {
        const currentQty = 500
        const currentCost = 500
        const purchases = []

        const aveCost = calculateAverageSales(
            currentQty,
            currentCost,
            purchases
        )

        expect(aveCost).to.equal(currentCost)
    })

    it('should return sales cost if only one purchase is made', () => {
        const currentQty = -10
        const currentCost = 0
        const purchases = [{ qty: 10, cost: 550 }]

        const aveCost = calculateAverageSales(
            currentQty,
            currentCost,
            purchases
        )

        expect(aveCost).to.equal(550)
    })

    it('should handle sales with zero quantity', () => {
        const currentQty = 450
        const currentCost = 500
        const purchases = [
            { qty: 0, cost: 0 },
            { qty: 20, cost: 600 },
            { qty: 30, cost: 650 },
        ]

        const aveCost = calculateAverageSales(
            currentQty,
            currentCost,
            purchases
        )

        expect(aveCost).to.be.closeTo(511.81, 0.01)
    })

    it('should return correct value down to the decimal', () => {
        const currentQty = 326
        const currentCost = 400
        const purchases = [{ qty: 120, cost: 420 }]

        const aveCost = calculateAverageSales(
            currentQty,
            currentCost,
            purchases
        )
        expect(aveCost).to.be.closeTo(404.24, 0.01)
    })
})
