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
