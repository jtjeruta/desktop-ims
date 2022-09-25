const { expect } = require('chai')

const CustomersModule = require('../../modules/customers-module')
const setup = require('../setup')
const testdata = require('../testdata')

describe('Module: Create Customer', () => {
    setup()

    it('Success: create customer using correct data', async () => {
        const createdCustomer = await CustomersModule.createCustomer(
            testdata.customer1
        )

        expect(createdCustomer[0]).to.equal(201)
        expect(createdCustomer[1].name).to.equal(testdata.customer1.name)
        expect(createdCustomer[1].phone).to.equal(testdata.customer1.phone)
        expect(createdCustomer[1].email).to.equal(testdata.customer1.email)
        expect(createdCustomer[1].address).to.equal(testdata.customer1.address)
    })

    it('Fail: create customer using invalid data', async () => {
        const createdCustomer = await CustomersModule.createCustomer({})
        expect(createdCustomer[0]).to.equal(400)
        expect(createdCustomer[1].errors.name.message).to.equal(
            'Path `name` is required.'
        )
    })

    it('Fail: create customer using duplicate name', async () => {
        await CustomersModule.createCustomer(testdata.customer1)
        const createdCustomer = await CustomersModule.createCustomer(
            testdata.customer1
        )
        expect(createdCustomer[0]).to.equal(409)
        expect(createdCustomer[1].message).to.equal('Duplicate found.')
    })
})

describe('Module: List Customers', () => {
    setup()

    it('Success: list all customers', async () => {
        await CustomersModule.createCustomer(testdata.customer1)
        await CustomersModule.createCustomer(testdata.customer2)
        const customers = await CustomersModule.listCustomers()
        expect(customers[0]).to.equal(200)
        expect(customers[1].length).to.equal(2)
    })
})

describe('Module: Get Customer by id', () => {
    setup()

    it('Success: given correct id', async () => {
        const createdCustomer = await CustomersModule.createCustomer(
            testdata.customer1
        )

        const foundCustomer = await CustomersModule.getCustomerById(
            createdCustomer[1]._id
        )

        expect(foundCustomer[0]).to.equal(200)
        expect(foundCustomer[1]._id.toString()).to.equal(
            createdCustomer[1]._id.toString()
        )
    })

    it('Fail: given wrong id', async () => {
        const foundCustomer = await CustomersModule.getCustomerById(null)
        expect(foundCustomer[0]).to.equal(404)
        expect(foundCustomer[1]).to.deep.equal({
            message: 'Customer not found.',
        })
    })
})

describe('Module: Update Customer', () => {
    setup()

    it('Success: update customer using correct data', async () => {
        const createdCustomer = await CustomersModule.createCustomer(
            testdata.customer1
        )
        const updatedCustomer = await CustomersModule.updateCustomer(
            createdCustomer[1]._id,
            testdata.customer2
        )

        expect(updatedCustomer[0]).to.equal(200)
        expect(updatedCustomer[1].name).to.equal(testdata.customer2.name)
        expect(updatedCustomer[1].email).to.equal(testdata.customer2.email)
        expect(updatedCustomer[1].phone).to.equal(testdata.customer2.phone)
        expect(updatedCustomer[1].address).to.equal(testdata.customer2.address)
    })

    it('Fail: update customer using invalid data', async () => {
        const createdCustomer = await CustomersModule.createCustomer(
            testdata.customer1
        )
        const updatedCustomer = await CustomersModule.updateCustomer(
            createdCustomer[1]._id,
            {
                name: '',
            }
        )

        expect(updatedCustomer[0]).to.equal(400)
        expect(updatedCustomer[1].errors.name.message).to.equal(
            'Path `name` is required.'
        )
    })

    it('Fail: update customer using duplicate name', async () => {
        await CustomersModule.createCustomer(testdata.customer1)
        const createdCustomer = await CustomersModule.createCustomer(
            testdata.customer2
        )
        const updatedCustomer = await CustomersModule.updateCustomer(
            createdCustomer[1]._id,
            testdata.customer1
        )

        expect(updatedCustomer[0]).to.equal(409)
        expect(updatedCustomer[1].message).to.equal('Duplicate found.')
    })
})
