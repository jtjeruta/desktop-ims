const { expect } = require('chai')
const request = require('supertest')

const setup = require('../setup')
const app = require('../../app')
const UsersModule = require('../../modules/users-module')

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
