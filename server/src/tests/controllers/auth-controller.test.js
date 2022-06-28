const { expect } = require('chai')
const request = require('supertest')

const setup = require('../setup')
const app = require('../../app')
const UsersModule = require('../../modules/users-module')
const { login } = require('../helpers')

describe('Login User', () => {
    setup()
    beforeEach(async () => {
        const user = {
            email: 'admin@gmail.com',
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
                UsersModule.deleteUserById(user.id).then(() => {
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
