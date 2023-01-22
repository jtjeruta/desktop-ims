const { faker } = require('@faker-js/faker')
const { dbConnect } = require('../src/lib/db')
const { createVendor, deleteVendors } = require('../src/modules/vendors-module')
require('../src/schemas/variant-schema')

dbConnect()

async function up() {
    const vendors = Array.from({ length: 10 }, () => ({
        name: faker.company.name(),
        phone: faker.phone.number('+63 90# ### ####'),
        email: faker.internet.email(),
        address: faker.address.streetAddress(),
        remarks: faker.lorem.paragraph(),
    }))

    const reponses = await Promise.all(
        vendors.map((vendor) => createVendor(vendor))
    )
    if (reponses.some((res) => res[0] !== 201)) {
        throw 'Failed to create vendor'
    }
}

async function down() {
    await deleteVendors()
}

module.exports = { up, down }
