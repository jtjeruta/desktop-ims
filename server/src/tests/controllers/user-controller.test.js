const { expect } = require('chai')
const request = require('supertest')

const setup = require('../setup')
const app = require('../../app')
const UsersModule = require('../../modules/users-module')
const { login } = require('../helpers')
const testdata = require('../testdata')

describe('List users', () => {
    setup()
    beforeEach(async () => {
        await UsersModule.createUser(testdata.admin1)
        await UsersModule.createUser(testdata.employee1)
    })

    it('Success: run as admin', (done) => {
        login({
            email: testdata.admin1.email,
            password: testdata.admin1.password,
        }).then(({ token }) => {
            request(app)
                .get('/api/v1/users')
                .set('Authorization', token)
                .then((res) => {
                    expect(res.statusCode).to.equal(200)
                    expect(res.body.users.length).to.equal(2)
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
                .get('/api/v1/users')
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
            .get('/api/v1/users')
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

describe('Create user', () => {
    setup()
    beforeEach(async () => {
        await UsersModule.createUser(testdata.admin1)
        await UsersModule.createUser(testdata.employee1)
    })

    it('Success: run as admin with correct data', (done) => {
        login({
            email: testdata.admin1.email,
            password: testdata.admin1.password,
        }).then(({ token }) => {
            request(app)
                .post('/api/v1/users')
                .send(testdata.employee2)
                .set('Authorization', token)
                .then((res) => {
                    expect(res.statusCode).to.equal(201)
                    expect(res.body.user.email).to.equal(
                        testdata.employee2.email
                    )
                    expect(res.body.user.role).to.equal(testdata.employee2.role)
                    expect(Object.keys(res.body.user)).to.include('id')
                    done()
                })
                .catch((err) => done(err))
        })
    })

    it('Fail: run as admin with incorrect data', (done) => {
        login({
            email: testdata.admin1.email,
            password: testdata.admin1.password,
        }).then(({ token }) => {
            request(app)
                .post('/api/v1/users')
                .send({
                    email: 'micah@gmai',
                    firstName: '',
                    lastName: '',
                    role: 'owner',
                    password: '',
                })
                .set('Authorization', token)
                .then((res) => {
                    expect(res.statusCode).to.equal(400)
                    expect(Object.keys(res.body.errors)).to.include('email')
                    expect(Object.keys(res.body.errors)).to.include('firstName')
                    expect(Object.keys(res.body.errors)).to.include('lastName')
                    expect(Object.keys(res.body.errors)).to.include('role')
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
                .post('/api/v1/users')
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
            .get('/api/v1/users')
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

describe('Update user', () => {
    const createdUsers = {}

    setup()
    beforeEach(async () => {
        const admin = await UsersModule.createUser(testdata.admin1)
        const employee = await UsersModule.createUser(testdata.employee1)
        createdUsers.admin = admin[1]
        createdUsers.employee = employee[1]
    })

    it('Success: run as admin with correct data', (done) => {
        login({
            email: testdata.admin1.email,
            password: testdata.admin1.password,
        }).then(({ token }) => {
            request(app)
                .put(`/api/v1/users/${createdUsers.admin.id}`)
                .send(testdata.employee2)
                .set('Authorization', token)
                .then((res) => {
                    expect(res.statusCode).to.equal(200)
                    expect(res.body.user.email).to.equal(
                        testdata.employee2.email
                    )
                    expect(res.body.user.role).to.equal(testdata.employee2.role)
                    expect(Object.keys(res.body.user)).to.include('id')
                    done()
                })
                .catch((err) => done(err))
        })
    })

    it('Fail: run as admin with incorrect data', (done) => {
        login({
            email: testdata.admin1.email,
            password: testdata.admin1.password,
        }).then(({ token }) => {
            request(app)
                .put(`/api/v1/users/${createdUsers.admin.id}`)
                .send({
                    email: 'micah@gmai',
                    firstName: '',
                    lastName: '',
                    role: 'owner',
                    password: '',
                })
                .set('Authorization', token)
                .then((res) => {
                    expect(res.statusCode).to.equal(400)
                    expect(Object.keys(res.body.errors)).to.include('email')
                    expect(Object.keys(res.body.errors)).to.include('firstName')
                    expect(Object.keys(res.body.errors)).to.include('lastName')
                    expect(Object.keys(res.body.errors)).to.include('role')
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
                .put(`/api/v1/users/${createdUsers.admin.id}`)
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
            .get('/api/v1/users')
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
