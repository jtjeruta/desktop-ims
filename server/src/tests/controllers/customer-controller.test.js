const { expect, use } = require('chai')
const request = require('supertest')
const deepEqualInAnyOrder = require('deep-equal-in-any-order')

const setup = require('../setup')
const app = require('../../app')
const UsersModule = require('../../modules/users-module')
const CustomersModule = require('../../modules/customers-module')
const { login } = require('../helpers')
const testdata = require('../testdata')

use(deepEqualInAnyOrder)

describe('Controller: List customers', () => {
    setup()
    beforeEach(async () => {
        await Promise.all([
            UsersModule.createUser(testdata.admin1),
            UsersModule.createUser(testdata.employee1),
            CustomersModule.createCustomer(testdata.customer1),
            CustomersModule.createCustomer(testdata.customer2),
        ])
    })

    it('Success: run as admin', async () => {
        const { token } = await login({
            email: testdata.admin1.email,
            password: testdata.admin1.password,
        })

        const res = await request(app)
            .get('/api/v1/customers')
            .set('Authorization', token)

        expect(res.statusCode).to.equal(200)
        expect(res.body.customers.length).to.equal(2)
    })

    it('Fail: run as employee', async () => {
        const { token } = await login({
            email: testdata.employee1.email,
            password: testdata.employee1.password,
        })

        const res = await request(app)
            .get('/api/v1/customers')
            .set('Authorization', token)

        expect(res.statusCode).to.equal(401)
        expect(res.body).to.deep.equal({
            message: 'Unauthorized.',
        })
    })

    it('Fail: run as unauthorized', async () => {
        const res = await request(app).get('/api/v1/customers')

        expect(res.statusCode).to.equal(401)
        expect(res.body).to.deep.equal({
            message: 'Unauthorized.',
        })
    })
})

describe('Controller: Create customer', () => {
    setup()
    beforeEach(async () => {
        await Promise.all([
            UsersModule.createUser(testdata.admin1),
            UsersModule.createUser(testdata.employee1),
        ])
    })

    it('Success: run as admin with correct data', async () => {
        const { token } = await login({
            email: testdata.admin1.email,
            password: testdata.admin1.password,
        })

        const res = await request(app)
            .post('/api/v1/customers')
            .send(testdata.customer1)
            .set('Authorization', token)

        expect(res.statusCode).to.equal(201)
        expect(res.body.customer.name).to.equal(testdata.customer1.name)
        expect(res.body.customer.email).to.equal(testdata.customer1.email)
        expect(res.body.customer.phone).to.equal(testdata.customer1.phone)
        expect(res.body.customer.address).to.equal(testdata.customer1.address)
    })

    it('Success: run as admin with incorrect data', async () => {
        const { token } = await login({
            email: testdata.admin1.email,
            password: testdata.admin1.password,
        })

        const res = await request(app)
            .post('/api/v1/customers')
            .send({})
            .set('Authorization', token)

        expect(res.statusCode).to.equal(400)
        expect(res.body.errors.name.message).to.equal(
            'Path `name` is required.'
        )
    })

    it('Fail: run as employee', async () => {
        const { token } = await login({
            email: testdata.employee1.email,
            password: testdata.employee1.password,
        })

        const res = await request(app)
            .post('/api/v1/customers')
            .send({})
            .set('Authorization', token)

        expect(res.statusCode).to.equal(401)
        expect(res.body).to.deep.equal({
            message: 'Unauthorized.',
        })
    })

    it('Fail: run as unauthorized', async () => {
        const res = await request(app).post('/api/v1/customers')

        expect(res.statusCode).to.equal(401)
        expect(res.body).to.deep.equal({
            message: 'Unauthorized.',
        })
    })
})

describe('Controller: Update customer', () => {
    setup()

    let customer = null

    beforeEach(async () => {
        const [customerRes] = await Promise.all([
            CustomersModule.createCustomer(testdata.customer1),
            UsersModule.createUser(testdata.admin1),
            UsersModule.createUser(testdata.employee1),
        ])

        customer = customerRes[1]
    })

    it('Success: run as admin with correct data', async () => {
        const { token } = await login({
            email: testdata.admin1.email,
            password: testdata.admin1.password,
        })

        const res = await request(app)
            .put(`/api/v1/customers/${customer._id}`)
            .send(testdata.customer2)
            .set('Authorization', token)

        expect(res.statusCode).to.equal(200)
        expect(res.body.customer.name).to.equal(testdata.customer2.name)
        expect(res.body.customer.email).to.equal(testdata.customer2.email)
        expect(res.body.customer.phone).to.equal(testdata.customer2.phone)
        expect(res.body.customer.address).to.equal(testdata.customer2.address)
    })

    it('Success: run as admin with incorrect data', async () => {
        const { token } = await login({
            email: testdata.admin1.email,
            password: testdata.admin1.password,
        })

        const res = await request(app)
            .put(`/api/v1/customers/${customer._id}`)
            .send({ name: '' })
            .set('Authorization', token)

        expect(res.statusCode).to.equal(400)
        expect(res.body.errors.name.message).to.equal(
            'Path `name` is required.'
        )
    })

    it('Fail: run as employee', async () => {
        const { token } = await login({
            email: testdata.employee1.email,
            password: testdata.employee1.password,
        })

        const res = await request(app)
            .put(`/api/v1/customers/${customer._id}`)
            .set('Authorization', token)

        expect(res.statusCode).to.equal(401)
        expect(res.body).to.deep.equal({
            message: 'Unauthorized.',
        })
    })

    it('Fail: run as unauthorized', async () => {
        const res = await request(app).put(`/api/v1/customers/${customer._id}`)

        expect(res.statusCode).to.equal(401)
        expect(res.body).to.deep.equal({
            message: 'Unauthorized.',
        })
    })
})
