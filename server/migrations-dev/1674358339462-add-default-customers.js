const { faker } = require('@faker-js/faker')
const { dbConnect } = require('../src/lib/db')
const {
    createCustomer,
    deleteCustomers,
} = require('../src/modules/customers-module')
require('../src/schemas/variant-schema')

dbConnect()

async function up() {
    const customers = Array.from({ length: 10 }, () => ({
        name: faker.company.name(),
        phone: faker.phone.number('+63 90# ### ####'),
        email: faker.internet.email(),
        address: faker.address.streetAddress(),
    }))

    const reponses = await Promise.all(
        customers.map((customer) => createCustomer(customer))
    )
    if (reponses.some((res) => res[0] !== 201)) {
        throw 'Failed to create customer'
    }
}

async function down() {
    await deleteCustomers()
}

module.exports = { up, down }
