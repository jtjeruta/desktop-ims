const { expect } = require('chai')
const request = require('supertest')

const setup = require('../setup')
const app = require('../../app')
const UsersModule = require('../../modules/users-module')
const { login } = require('../helpers')
const testdata = require('../testdata')

describe('Login User', () => {
    setup()
    beforeEach(async () => {
        const user = {
            email: 'admin@gmail.com',
            username: 'admin',
            firstName: 'admin',
            lastName: 'admin',
            role: 'admin',
            password: 'password',
        }

        await UsersModule.createUser(user)
    })

    it('Success: correct details', (done) => {
        request(app)
            .post('/api/v1/auth/login')
            .send({
                email: 'admin@gmail.com',
                password: 'password',
            })
            .then((res) => {
                expect(res.statusCode).to.equal(200)
                expect(Object.keys(res.body)).to.include('token')
                done()
            })
            .catch((err) => done(err))
    })

    it('Fail: wrong password', (done) => {
        request(app)
            .post('/api/v1/auth/login')
            .send({
                email: 'admin@gmail.com',
                password: 'wrong_password',
            })
            .then((res) => {
                expect(res.statusCode).to.equal(400)
                expect(res.body).to.include({
                    message: 'Wrong username or password.',
                })
                done()
            })
            .catch((err) => done(err))
    })
})

describe('Verify Token', () => {
    setup()
    beforeEach(async () => {
        const admin = {
            email: 'admin@gmail.com',
            username: 'admin',
            firstName: 'admin',
            lastName: 'admin',
            role: 'admin',
            password: 'password',
        }

        await UsersModule.createUser(admin)
    })

    it('Success: correct token', (done) => {
        login({ email: 'admin@gmail.com', password: 'password' }).then(
            ({ token, user }) => {
                request(app)
                    .post('/api/v1/auth/verify-token')
                    .send({ token })
                    .then((res) => {
                        expect(res.statusCode).to.equal(200)
                        expect(res.body).to.deep.equal({
                            user,
                        })
                        done()
                    })
                    .catch((err) => done(err))
            }
        )
    })

    it('Fail: wrong token', (done) => {
        request(app)
            .post('/api/v1/auth/verify-token')
            .send({ token: 'WRONG-TOKEN' })
            .then((res) => {
                expect(res.statusCode).to.equal(403)
                expect(res.body.message).to.equal(
                    'Token failed to be verified.'
                )
                done()
            })
            .catch((err) => done(err))
    })

    it('Success: correct token but user not found', (done) => {
        login({ email: 'admin@gmail.com', password: 'password' }).then(
            ({ token, user }) => {
                UsersModule.deleteUser({ _id: user.id }).then(() => {
                    request(app)
                        .post('/api/v1/auth/verify-token')
                        .send({ token })
                        .then((res) => {
                            expect(res.statusCode).to.equal(404)
                            expect(res.body).to.deep.equal({
                                message: 'Not found.',
                            })
                            done()
                        })
                        .catch((err) => done(err))
                })
            }
        )
    })
})

describe('Setup', () => {
    setup()

    it('Success: correct details', async () => {
        const res = await request(app).post('/api/v1/auth/setup').send({
            username: 'admin',
            firstName: 'admin',
            lastName: 'admin',
            email: 'admin@gmail.com',
            password: 'password',
        })

        expect(res.statusCode).to.equal(201)
        expect(Object.keys(res.body)).to.include('token')
        expect(Object.keys(res.body)).to.include('user')
    })

    it('Fail: missing details', async () => {
        const res = await request(app).post('/api/v1/auth/setup').send({})
        expect(res.statusCode).to.equal(400)
        expect(res.body.errors.lastName.message).is.equal(
            'Path `lastName` is required.'
        )
        expect(res.body.errors.firstName.message).is.equal(
            'Path `firstName` is required.'
        )
        expect(res.body.errors.email.message).is.equal(
            'Path `email` is required.'
        )
        expect(res.body.errors.username.message).is.equal(
            'Path `username` is required.'
        )
    })

    it('Fail: user already exists', async () => {
        const user = {
            username: 'admin',
            firstName: 'admin',
            lastName: 'admin',
            email: 'admin@gmail.com',
            password: 'password',
            role: 'admin',
        }

        await UsersModule.createUser(user)
        const res = await request(app).post('/api/v1/auth/setup').send(user)
        expect(res.statusCode).to.equal(400)
        expect(res.body).to.include({
            message: 'User already exists.',
        })
    })
})

describe('Forgot password', () => {
    setup()
    beforeEach(async () => {
        await UsersModule.createUser(testdata.admin1)
    })

    it('Success: correct details', async () => {
        const res = await request(app)
            .post('/api/v1/auth/forgot-password')
            .send({
                email: testdata.admin1.email,
                code: 'b4d72cb6-b13a-4f19-8b26-b9abe3b7aee0',
            })

        expect(res.statusCode).to.equal(200)
        expect(Object.keys(res.body)).to.include('token')
        expect(Object.keys(res.body)).to.include('user')
    })

    it('Fail: incorrect code', async () => {
        const res = await request(app)
            .post('/api/v1/auth/forgot-password')
            .send({
                email: 'admin@gmail.com',
                code: 'b4d72cb6-b13a-4f19-8b26-b9abe3b7aee',
            })
        expect(res.statusCode).to.equal(400)
        expect(res.body).to.include({ message: 'Invalid code.' })
    })
})
