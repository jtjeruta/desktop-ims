const { expect, use } = require('chai')
const request = require('supertest')
const deepEqualInAnyOrder = require('deep-equal-in-any-order')

const setup = require('../setup')
const app = require('../../app')
const UsersModule = require('../../modules/users-module')
const VendorsModule = require('../../modules/vendors-module')
const { login } = require('../helpers')
const testdata = require('../testdata')

use(deepEqualInAnyOrder)

describe('Controller: List vendors', () => {
    setup()
    beforeEach(async () => {
        await UsersModule.createUser(testdata.admin1)
        await UsersModule.createUser(testdata.employee1)

        await VendorsModule.createVendor(testdata.vendor1)
        await VendorsModule.createVendor(testdata.vendor2)
    })

    it('Success: run as admin', async () => {
        const { token } = await login({
            email: testdata.admin1.email,
            password: testdata.admin1.password,
        })

        const res = await request(app)
            .get('/api/v1/vendors')
            .set('Authorization', token)

        expect(res.statusCode).to.equal(200)
        expect(res.body.vendors.length).to.equal(2)
    })

    it('Fail: run as employee', async () => {
        const { token } = await login({
            email: testdata.employee1.email,
            password: testdata.employee1.password,
        })

        const res = await request(app)
            .get('/api/v1/vendors')
            .set('Authorization', token)

        expect(res.statusCode).to.equal(401)
        expect(res.body).to.deep.equal({
            message: 'Unauthorized.',
        })
    })

    it('Fail: run as unauthorized', async () => {
        const res = await request(app).get('/api/v1/vendors')

        expect(res.statusCode).to.equal(401)
        expect(res.body).to.deep.equal({
            message: 'Unauthorized.',
        })
    })
})

describe('Controller: Create vendor', () => {
    setup()
    beforeEach(async () => {
        await UsersModule.createUser(testdata.admin1)
        await UsersModule.createUser(testdata.employee1)
    })

    it('Success: run as admin with correct data', async () => {
        const { token } = await login({
            email: testdata.admin1.email,
            password: testdata.admin1.password,
        })

        const res = await request(app)
            .post('/api/v1/vendors')
            .send(testdata.vendor1)
            .set('Authorization', token)

        expect(res.statusCode).to.equal(201)
        expect(res.body.vendor.name).to.equal(testdata.vendor1.name)
        expect(res.body.vendor.email).to.equal(testdata.vendor1.email)
        expect(res.body.vendor.phone).to.equal(testdata.vendor1.phone)
        expect(res.body.vendor.address).to.equal(testdata.vendor1.address)
    })

    it('Success: run as admin with incorrect data', async () => {
        const { token } = await login({
            email: testdata.admin1.email,
            password: testdata.admin1.password,
        })

        const res = await request(app)
            .post('/api/v1/vendors')
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
            .post('/api/v1/vendors')
            .send({})
            .set('Authorization', token)

        expect(res.statusCode).to.equal(401)
        expect(res.body).to.deep.equal({
            message: 'Unauthorized.',
        })
    })

    it('Fail: run as unauthorized', async () => {
        const res = await request(app).post('/api/v1/vendors')

        expect(res.statusCode).to.equal(401)
        expect(res.body).to.deep.equal({
            message: 'Unauthorized.',
        })
    })
})

describe('Controller: Update vendor', () => {
    setup()

    let vendor = null

    beforeEach(async () => {
        await UsersModule.createUser(testdata.admin1)
        await UsersModule.createUser(testdata.employee1)
        vendor = (await VendorsModule.createVendor(testdata.vendor1))[1]
    })

    it('Success: run as admin with correct data', async () => {
        const { token } = await login({
            email: testdata.admin1.email,
            password: testdata.admin1.password,
        })

        const res = await request(app)
            .put(`/api/v1/vendors/${vendor._id}`)
            .send(testdata.vendor2)
            .set('Authorization', token)

        expect(res.statusCode).to.equal(200)
        expect(res.body.vendor.name).to.equal(testdata.vendor2.name)
        expect(res.body.vendor.email).to.equal(testdata.vendor2.email)
        expect(res.body.vendor.phone).to.equal(testdata.vendor2.phone)
        expect(res.body.vendor.address).to.equal(testdata.vendor2.address)
    })

    it('Success: run as admin with incorrect data', async () => {
        const { token } = await login({
            email: testdata.admin1.email,
            password: testdata.admin1.password,
        })

        const res = await request(app)
            .put(`/api/v1/vendors/${vendor._id}`)
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
            .put(`/api/v1/vendors/${vendor._id}`)
            .set('Authorization', token)

        expect(res.statusCode).to.equal(401)
        expect(res.body).to.deep.equal({
            message: 'Unauthorized.',
        })
    })

    it('Fail: run as unauthorized', async () => {
        const res = await request(app).put(`/api/v1/vendors/${vendor._id}`)

        expect(res.statusCode).to.equal(401)
        expect(res.body).to.deep.equal({
            message: 'Unauthorized.',
        })
    })
})
