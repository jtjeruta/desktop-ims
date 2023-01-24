const { expect, use } = require('chai')
const request = require('supertest')
const deepEqualInAnyOrder = require('deep-equal-in-any-order')

const setup = require('../setup')
const app = require('../../app')
const UsersModule = require('../../modules/users-module')
const ExpensesModule = require('../../modules/expenses-module')
const { login } = require('../helpers')
const testdata = require('../testdata')

use(deepEqualInAnyOrder)

describe('Controller: List expenses', () => {
    const created = {}
    setup()
    beforeEach(async () => {
        const userRes = await Promise.all([
            UsersModule.createUser(testdata.admin1),
            UsersModule.createUser(testdata.employee1),
        ])

        created.admin = userRes[0][1]
        created.employee = userRes[1][1]

        const expenseRes = await Promise.all([
            ExpensesModule.createExpense({
                ...testdata.expense1,
                user: created.admin._id,
            }),
            ExpensesModule.createExpense({
                ...testdata.expense2,
                user: created.employee._id,
            }),
        ])

        created.expense1 = expenseRes[0][1]
        created.expense2 = expenseRes[1][1]
    })

    it('Success: run as admin', async () => {
        const { token } = await login({
            email: testdata.admin1.email,
            password: testdata.admin1.password,
        })

        const res = await request(app)
            .get('/api/v1/expenses')
            .set('Authorization', token)

        expect(res.statusCode).to.equal(200)
        expect(res.body.expenses.length).to.equal(2)
    })

    it('Fail: run as employee', async () => {
        const { token } = await login({
            email: testdata.employee1.email,
            password: testdata.employee1.password,
        })

        const res = await request(app)
            .get('/api/v1/expenses')
            .set('Authorization', token)

        expect(res.statusCode).to.equal(401)
        expect(res.body).to.deep.equal({
            message: 'Unauthorized.',
        })
    })

    it('Fail: run as unauthorized', async () => {
        const res = await request(app).get('/api/v1/expenses')

        expect(res.statusCode).to.equal(401)
        expect(res.body).to.deep.equal({
            message: 'Unauthorized.',
        })
    })
})

describe('Controller: Create expense', () => {
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
            .post('/api/v1/expenses')
            .send(testdata.expense1)
            .set('Authorization', token)

        expect(res.statusCode).to.equal(201)
        expect(res.body.expense.name).to.equal(testdata.expense1.name)
        expect(res.body.expense.description).to.equal(
            testdata.expense1.description
        )
        expect(res.body.expense.date).to.equal(testdata.expense1.date)
        expect(res.body.expense.amount).to.equal(testdata.expense1.amount)
        expect(res.body.expense.user).to.equal(testdata.admin1.name)
    })

    it('Success: run as admin with incorrect data', async () => {
        const { token } = await login({
            email: testdata.admin1.email,
            password: testdata.admin1.password,
        })

        const res = await request(app)
            .post('/api/v1/expenses')
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
            .post('/api/v1/expenses')
            .send({})
            .set('Authorization', token)

        expect(res.statusCode).to.equal(401)
        expect(res.body).to.deep.equal({
            message: 'Unauthorized.',
        })
    })

    it('Fail: run as unauthorized', async () => {
        const res = await request(app).post('/api/v1/expenses')

        expect(res.statusCode).to.equal(401)
        expect(res.body).to.deep.equal({
            message: 'Unauthorized.',
        })
    })
})

describe('Controller: Update expense', () => {
    setup()

    let expense = null

    beforeEach(async () => {
        const admin = await UsersModule.createUser(testdata.admin1)
        await UsersModule.createUser(testdata.employee1)
        const expenseRes = await ExpensesModule.createExpense({
            ...testdata.expense1,
            user: admin[1]._id,
        })
        expense = expenseRes[1]
    })

    it('Success: run as admin with correct data', async () => {
        const { token } = await login({
            email: testdata.admin1.email,
            password: testdata.admin1.password,
        })

        const res = await request(app)
            .put(`/api/v1/expenses/${expense._id}`)
            .send(testdata.expense2)
            .set('Authorization', token)

        expect(res.statusCode).to.equal(200)
        expect(res.body.expense.name).to.equal(testdata.expense2.name)
        expect(res.body.expense.description).to.equal(
            testdata.expense2.description
        )
        expect(res.body.expense.date).to.equal(testdata.expense2.date)
        expect(res.body.expense.amount).to.equal(testdata.expense2.amount)
        expect(res.body.expense.user).to.equal(testdata.admin1.name)
    })

    it('Success: run as admin with incorrect data', async () => {
        const { token } = await login({
            email: testdata.admin1.email,
            password: testdata.admin1.password,
        })

        const res = await request(app)
            .put(`/api/v1/expenses/${expense._id}`)
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
            .put(`/api/v1/expenses/${expense._id}`)
            .set('Authorization', token)

        expect(res.statusCode).to.equal(401)
        expect(res.body).to.deep.equal({
            message: 'Unauthorized.',
        })
    })

    it('Fail: run as unauthorized', async () => {
        const res = await request(app).put(`/api/v1/expenses/${expense._id}`)

        expect(res.statusCode).to.equal(401)
        expect(res.body).to.deep.equal({
            message: 'Unauthorized.',
        })
    })
})

describe('Controller: Delete expense', () => {
    setup()

    let expense = null

    beforeEach(async () => {
        const admin = await UsersModule.createUser(testdata.admin1)
        await UsersModule.createUser(testdata.employee1)
        const expenseRes = await ExpensesModule.createExpense({
            ...testdata.expense1,
            user: admin[1]._id,
        })
        expense = expenseRes[1]
    })

    it('Success: run as admin', async () => {
        const { token } = await login({
            email: testdata.admin1.email,
            password: testdata.admin1.password,
        })

        const res = await request(app)
            .delete(`/api/v1/expenses/${expense._id}`)
            .set('Authorization', token)

        expect(res.statusCode).to.equal(200)
    })

    it('Fail: run as employee', async () => {
        const { token } = await login({
            email: testdata.employee1.email,
            password: testdata.employee1.password,
        })

        const res = await request(app)
            .delete(`/api/v1/expenses/${expense._id}`)
            .set('Authorization', token)

        expect(res.statusCode).to.equal(401)
        expect(res.body).to.deep.equal({
            message: 'Unauthorized.',
        })
    })

    it('Fail: run as unauthorized', async () => {
        const res = await request(app).delete(`/api/v1/expenses/${expense._id}`)

        expect(res.statusCode).to.equal(401)
        expect(res.body).to.deep.equal({
            message: 'Unauthorized.',
        })
    })
})
