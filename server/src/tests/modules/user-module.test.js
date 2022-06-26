const { expect } = require('chai')

const setup = require('../setup')
const UsersModule = require('../../modules/users-module')
const testdata = require('../testdata')

describe('Create User', () => {
    setup()

    it('Success: create admin using correct data', async () => {
        const createdUser = await UsersModule.createUser(testdata.admin1)

        expect(createdUser[0]).to.equal(201)
        expect(createdUser[1].email).to.includes(testdata.admin1.email)
        expect(createdUser[1].firstName).to.includes(testdata.admin1.firstName)
        expect(createdUser[1].lastName).to.includes(testdata.admin1.lastName)
        expect(createdUser[1].role).to.includes(testdata.admin1.role)
    })

    it('Success: create employee using correct data', async () => {
        const createdUser = await UsersModule.createUser(testdata.employee1)

        expect(createdUser[0]).to.equal(201)
        expect(createdUser[1].email).to.includes(testdata.employee1.email)
        expect(createdUser[1].firstName).to.includes(
            testdata.employee1.firstName
        )
        expect(createdUser[1].lastName).to.includes(testdata.employee1.lastName)
        expect(createdUser[1].role).to.includes(testdata.employee1.role)
    })

    it('Fail: create user using invalid data', async () => {
        const createdUser = await UsersModule.createUser({
            email: 'invalid-email',
            role: 'invalid-role',
        })
        expect(createdUser[0]).to.equal(400)
        expect(createdUser[1].errors.role.message).to.equal(
            '`invalid-role` is not a valid enum value for path `role`.'
        )
        expect(createdUser[1].errors.email.message).to.equal(
            'Validator failed for path `email` with value `invalid-email`'
        )
        expect(createdUser[1].errors.firstName.message).to.equal(
            'Path `firstName` is required.'
        )
        expect(createdUser[1].errors.lastName.message).to.equal(
            'Path `lastName` is required.'
        )
    })

    it('Fail: create user using duplicate email', async () => {
        await UsersModule.createUser(testdata.admin1)
        const createdUser = await UsersModule.createUser(testdata.admin1)
        expect(createdUser[0]).to.equal(409)
        expect(createdUser[1].message).to.equal('Duplicate found.')
    })
})

describe('List Users', () => {
    setup()

    it('Success: list all users', async () => {
        await UsersModule.createUser(testdata.admin1)
        await UsersModule.createUser(testdata.employee1)
        const users = await UsersModule.listUsers()
        expect(users[0]).to.equal(200)
        expect(users[1].length).to.equal(2)
    })
})
