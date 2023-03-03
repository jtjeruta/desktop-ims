const { expect, use } = require('chai')
const request = require('supertest')
const deepEqualInAnyOrder = require('deep-equal-in-any-order')

const setup = require('../setup')
const app = require('../../app')
const UsersModule = require('../../modules/users-module')
const ReceivablesModule = require('../../modules/receivables-module')
const { login } = require('../helpers')
const testdata = require('../testdata')

use(deepEqualInAnyOrder)

describe('Controller: List receivables', () => {
    const created = {}
    setup()
    beforeEach(async () => {
        const userRes = await Promise.all([
            UsersModule.createUser(testdata.admin1),
            UsersModule.createUser(testdata.employee1),
        ])

        created.admin = userRes[0][1]
        created.employee = userRes[1][1]

        const receivableRes = await Promise.all([
            ReceivablesModule.createReceivable({
                ...testdata.receivable1,
                user: created.admin._id,
            }),
            ReceivablesModule.createReceivable({
                ...testdata.receivable2,
                user: created.employee._id,
            }),
        ])

        created.receivable1 = receivableRes[0][1]
        created.receivable2 = receivableRes[1][1]
    })

    it('Success: run as admin', async () => {
        const { token } = await login({
            email: testdata.admin1.email,
            password: testdata.admin1.password,
        })

        const res = await request(app)
            .get('/api/v1/receivables')
            .set('Authorization', token)

        expect(res.statusCode).to.equal(200)
        expect(res.body.receivables.length).to.equal(2)
    })

    it('Fail: run as employee', async () => {
        const { token } = await login({
            email: testdata.employee1.email,
            password: testdata.employee1.password,
        })

        const res = await request(app)
            .get('/api/v1/receivables')
            .set('Authorization', token)

        expect(res.statusCode).to.equal(401)
        expect(res.body).to.deep.equal({
            message: 'Unauthorized.',
        })
    })

    it('Fail: run as unauthorized', async () => {
        const res = await request(app).get('/api/v1/receivables')

        expect(res.statusCode).to.equal(401)
        expect(res.body).to.deep.equal({
            message: 'Unauthorized.',
        })
    })
})

describe('Controller: Create receivable', () => {
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
            .post('/api/v1/receivables')
            .send(testdata.receivable1)
            .set('Authorization', token)

        expect(res.statusCode).to.equal(201)
        expect(res.body.receivable.name).to.equal(testdata.receivable1.name)
        expect(res.body.receivable.description).to.equal(
            testdata.receivable1.description
        )
        expect(res.body.receivable.date).to.equal(testdata.receivable1.date)
        expect(res.body.receivable.amount).to.equal(testdata.receivable1.amount)
        expect(res.body.receivable.user).to.equal(testdata.admin1.name)
    })

    it('Success: run as admin with incorrect data', async () => {
        const { token } = await login({
            email: testdata.admin1.email,
            password: testdata.admin1.password,
        })

        const res = await request(app)
            .post('/api/v1/receivables')
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
            .post('/api/v1/receivables')
            .send({})
            .set('Authorization', token)

        expect(res.statusCode).to.equal(401)
        expect(res.body).to.deep.equal({
            message: 'Unauthorized.',
        })
    })

    it('Fail: run as unauthorized', async () => {
        const res = await request(app).post('/api/v1/receivables')

        expect(res.statusCode).to.equal(401)
        expect(res.body).to.deep.equal({
            message: 'Unauthorized.',
        })
    })
})

describe('Controller: Update receivable', () => {
    setup()

    let receivable = null

    beforeEach(async () => {
        const admin = await UsersModule.createUser(testdata.admin1)
        await UsersModule.createUser(testdata.employee1)
        const receivableRes = await ReceivablesModule.createReceivable({
            ...testdata.receivable1,
            user: admin[1]._id,
        })
        receivable = receivableRes[1]
    })

    it('Success: run as admin with correct data', async () => {
        const { token } = await login({
            email: testdata.admin1.email,
            password: testdata.admin1.password,
        })

        const res = await request(app)
            .put(`/api/v1/receivables/${receivable._id}`)
            .send(testdata.receivable2)
            .set('Authorization', token)

        expect(res.statusCode).to.equal(200)
        expect(res.body.receivable.name).to.equal(testdata.receivable2.name)
        expect(res.body.receivable.description).to.equal(
            testdata.receivable2.description
        )
        expect(res.body.receivable.date).to.equal(testdata.receivable2.date)
        expect(res.body.receivable.amount).to.equal(testdata.receivable2.amount)
        expect(res.body.receivable.user).to.equal(testdata.admin1.name)
    })

    it('Success: run as admin with incorrect data', async () => {
        const { token } = await login({
            email: testdata.admin1.email,
            password: testdata.admin1.password,
        })

        const res = await request(app)
            .put(`/api/v1/receivables/${receivable._id}`)
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
            .put(`/api/v1/receivables/${receivable._id}`)
            .set('Authorization', token)

        expect(res.statusCode).to.equal(401)
        expect(res.body).to.deep.equal({
            message: 'Unauthorized.',
        })
    })

    it('Fail: run as unauthorized', async () => {
        const res = await request(app).put(
            `/api/v1/receivables/${receivable._id}`
        )

        expect(res.statusCode).to.equal(401)
        expect(res.body).to.deep.equal({
            message: 'Unauthorized.',
        })
    })
})

describe('Controller: Delete receivable', () => {
    setup()

    let receivable = null

    beforeEach(async () => {
        const admin = await UsersModule.createUser(testdata.admin1)
        await UsersModule.createUser(testdata.employee1)
        const receivableRes = await ReceivablesModule.createReceivable({
            ...testdata.receivable1,
            user: admin[1]._id,
        })
        receivable = receivableRes[1]
    })

    it('Success: run as admin', async () => {
        const { token } = await login({
            email: testdata.admin1.email,
            password: testdata.admin1.password,
        })

        const res = await request(app)
            .delete(`/api/v1/receivables/${receivable._id}`)
            .set('Authorization', token)

        expect(res.statusCode).to.equal(200)
    })

    it('Fail: run as employee', async () => {
        const { token } = await login({
            email: testdata.employee1.email,
            password: testdata.employee1.password,
        })

        const res = await request(app)
            .delete(`/api/v1/receivables/${receivable._id}`)
            .set('Authorization', token)

        expect(res.statusCode).to.equal(401)
        expect(res.body).to.deep.equal({
            message: 'Unauthorized.',
        })
    })

    it('Fail: run as unauthorized', async () => {
        const res = await request(app).delete(
            `/api/v1/receivables/${receivable._id}`
        )

        expect(res.statusCode).to.equal(401)
        expect(res.body).to.deep.equal({
            message: 'Unauthorized.',
        })
    })
})
