const { faker } = require('@faker-js/faker')
const moment = require('moment')
const { dbConnect } = require('../src/lib/db')
const ReceivableModule = require('../src/modules/receivables-module')
const UsersModule = require('../src/modules/users-module')
require('../src/schemas/variant-schema')

dbConnect()

async function up() {
    const users = await UsersModule.listUsers()

    const receivables = Array.from({ length: 200 }, () => ({
        name: faker.commerce.productName(),
        description: faker.lorem.paragraph(),
        amount: faker.finance.amount(100, 1000, 2),
        date: moment(faker.date.past()).unix(),
        user: faker.helpers.arrayElement(users[1])._id,
    }))

    const responses = await Promise.all(
        receivables.map((receivable) =>
            ReceivableModule.createReceivable(receivable)
        )
    )
    if (responses.some((res) => res[0] !== 201)) {
        throw 'Failed to create receivable'
    }
}

async function down() {
    await ReceivableModule.deleteReceivables()
}

module.exports = { up, down }
