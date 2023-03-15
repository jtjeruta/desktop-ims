const { faker } = require('@faker-js/faker')
const { dbConnect } = require('../src/lib/db')
const { listProducts } = require('../src/modules/products-module')
const {
    createWarehouse,
    deleteWarehouses,
} = require('../src/modules/warehouses-module')
require('../src/schemas/variant-schema')
const { getRandomSubset } = require('../src/utils/array')

dbConnect()

async function up() {
    const products = await listProducts()

    const warehouses = Array.from({ length: 10 }, () => ({
        name: faker.company.name(),
        products: getRandomSubset(products[1], faker.random.numeric({ min: 0, max: 20 })).map(
            (product) => ({
                source: product._id,
                stock: faker.random.numeric({ min: 0, max: 100 }),
            })
        ),
    }))

    const responses = await Promise.all(
        warehouses.map((warehouse) => createWarehouse(warehouse))
    )
    if (responses.some((res) => res[0] !== 201)) {
        throw 'Failed to create warehouse'
    }
}

async function down() {
    await deleteWarehouses()
}

module.exports = { up, down }
