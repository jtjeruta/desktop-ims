const { expect } = require('chai')
const request = require('supertest')

const setup = require('../setup')
const app = require('../../app')
const UsersModule = require('../../modules/users-module')
const { login } = require('../helpers')

describe('List users', () => {
    setup()
    beforeEach(async () => {
        const admin = {
            email: 'admin@gmail.com',
            firstName: 'admin',
            lastName: 'admin',
            role: 'admin',
            password: 'password',
        }

        const employee = {
            email: 'employee@gmail.com',
            firstName: 'employee',
            lastName: 'employee',
            role: 'employee',
            password: 'password',
        }

        await UsersModule.createUser(admin)
        await UsersModule.createUser(employee)
    })

    it('Success: run as admin', (done) => {
        login({ email: 'admin@gmail.com', password: 'password' }).then(
            ({ token }) => {
                request(app)
                    .get('/api/v1/users')
                    .set('Authorization', token)
                    .then((res) => {
                        expect(res.statusCode).to.equal(200)
                        expect(res.body.users.length).to.equal(2)
                        done()
                    })
                    .catch((err) => done(err))
            }
        )
    })

    it('Fail: run as employee', (done) => {
        login({ email: 'employee@gmail.com', password: 'password' }).then(
            ({ token }) => {
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
            }
        )
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
        const admin = {
            email: 'admin@gmail.com',
            firstName: 'admin',
            lastName: 'admin',
            role: 'admin',
            password: 'password',
        }

        const employee = {
            email: 'employee@gmail.com',
            firstName: 'employee',
            lastName: 'employee',
            role: 'employee',
            password: 'password',
        }

        await UsersModule.createUser(admin)
        await UsersModule.createUser(employee)
    })

    it('Success: run as admin with correct data', (done) => {
        login({ email: 'admin@gmail.com', password: 'password' }).then(
            ({ token }) => {
                request(app)
                    .post('/api/v1/users')
                    .send({
                        email: 'employee2@gmail.com',
                        firstName: 'employee2',
                        lastName: 'employee2LastName',
                        role: 'employee',
                        password: 'password',
                    })
                    .set('Authorization', token)
                    .then((res) => {
                        expect(res.statusCode).to.equal(201)
                        expect(res.body.user.email).to.equal(
                            'employee2@gmail.com'
                        )
                        expect(res.body.user.firstName).to.equal('employee2')
                        expect(res.body.user.lastName).to.equal(
                            'employee2LastName'
                        )
                        expect(res.body.user.role).to.equal('employee')
                        expect(Object.keys(res.body.user)).to.include('id')
                        done()
                    })
                    .catch((err) => done(err))
            }
        )
    })

    it('Success: run as admin with incorrect data', (done) => {
        login({ email: 'admin@gmail.com', password: 'password' }).then(
            ({ token }) => {
                request(app)
                    .post('/api/v1/users')
                    .send({
                        email: 'employee2@gmai',
                        firstName: '',
                        lastName: '',
                        role: 'owner',
                        password: '',
                    })
                    .set('Authorization', token)
                    .then((res) => {
                        expect(res.statusCode).to.equal(400)
                        expect(Object.keys(res.body.errors)).to.include('email')
                        expect(Object.keys(res.body.errors)).to.include(
                            'firstName'
                        )
                        expect(Object.keys(res.body.errors)).to.include(
                            'lastName'
                        )
                        expect(Object.keys(res.body.errors)).to.include('role')
                        done()
                    })
                    .catch((err) => done(err))
            }
        )
    })

    it('Fail: run as employee', (done) => {
        login({ email: 'employee@gmail.com', password: 'password' }).then(
            ({ token }) => {
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
            }
        )
    })

    it.only('Fail: run as unauthorized', (done) => {
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
