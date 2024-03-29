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
            .post('/api/v1/users')
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
            .post('/api/v1/users')
            .send({})
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

describe('Delete user', () => {
    const createdUsers = {}

    setup()
    beforeEach(async () => {
        const admin = await UsersModule.createUser(testdata.admin1)
        const employee = await UsersModule.createUser(testdata.employee1)
        createdUsers.admin = admin[1]
        createdUsers.employee = employee[1]
    })

    it('Success: run as admin to delete employee', (done) => {
        login({
            email: testdata.admin1.email,
            password: testdata.admin1.password,
        }).then(({ token }) => {
            request(app)
                .delete(`/api/v1/users/${createdUsers.employee.id}`)
                .set('Authorization', token)
                .then((res) => {
                    expect(res.statusCode).to.equal(200)
                    done()
                })
                .catch((err) => done(err))
        })
    })

    it('Fail: run as admin to delete self', (done) => {
        login({
            email: testdata.admin1.email,
            password: testdata.admin1.password,
        }).then(({ token }) => {
            request(app)
                .delete(`/api/v1/users/${createdUsers.admin.id}`)
                .set('Authorization', token)
                .then((res) => {
                    expect(res.statusCode).to.equal(405)
                    expect(res.body.message).to.equal('Not allowed.')
                    done()
                })
                .catch((err) => done(err))
        })
    })

    it('Fail: run as employee to delete admin', (done) => {
        login({
            email: testdata.employee1.email,
            password: testdata.employee1.password,
        }).then(({ token }) => {
            request(app)
                .delete(`/api/v1/users/${createdUsers.admin.id}`)
                .set('Authorization', token)
                .then((res) => {
                    expect(res.statusCode).to.equal(401)
                    expect(res.body.message).to.equal('Unauthorized.')
                    done()
                })
                .catch((err) => done(err))
        })
    })
})

describe('Change Password', () => {
    const createdUsers = {}

    setup()
    beforeEach(async () => {
        const admin = await UsersModule.createUser(testdata.admin1)
        const employee = await UsersModule.createUser(testdata.employee1)
        createdUsers.admin = admin[1]
        createdUsers.employee = employee[1]
    })

    it('Success: run as admin with correct data', async () => {
        const { token } = await login({
            email: testdata.admin1.email,
            password: testdata.admin1.password,
        })

        const res = await request(app)
            .put(`/api/v1/users/${createdUsers.admin.id}/password`)
            .set('Authorization', token)
            .send({ password: 'newpassword' })

        expect(res.statusCode).to.equal(200)

        const { token: newToken } = await login({
            email: testdata.admin1.email,
            password: 'newpassword',
        })

        expect(newToken).to.be.a('string')

        const { token: oldToken, message } = await login({
            email: testdata.admin1.email,
            password: testdata.admin1.password,
        })

        expect(oldToken).to.be.undefined
        expect(message).to.equal('Wrong username or password.')
    })

    it('Fail: run as admin with incorrect data', async () => {
        const { token } = await login({
            email: testdata.admin1.email,
            password: testdata.admin1.password,
        })

        const res = await request(app)
            .put(`/api/v1/users/${createdUsers.admin.id}/password`)
            .set('Authorization', token)
            .send({ password: '' })

        expect(res.statusCode).to.equal(400)
        expect(res.body.errors).to.deep.equal({
            password: 'Password must be at least 8 characters long.',
        })
    })

    it('Fail: run as employee', async () => {
        const { token } = await login({
            email: testdata.employee1.email,
            password: testdata.employee1.password,
        })

        const res = await request(app)
            .put(`/api/v1/users/${createdUsers.admin.id}/password`)
            .set('Authorization', token)
            .send({ password: 'newpassword' })

        expect(res.statusCode).to.equal(401)
        expect(res.body.message).to.equal('Unauthorized.')
    })
})
