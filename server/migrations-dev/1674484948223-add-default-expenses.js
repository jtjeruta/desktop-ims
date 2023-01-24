const { faker } = require('@faker-js/faker')
const moment = require('moment')
const { dbConnect } = require('../src/lib/db')
const ExpenseModule = require('../src/modules/expenses-module')
const UsersModule = require('../src/modules/users-module')
require('../src/schemas/variant-schema')

dbConnect()

async function up() {
    const users = await UsersModule.listUsers()

    const expenses = Array.from({ length: 200 }, () => ({
        name: faker.commerce.productName(),
        description: faker.lorem.paragraph(),
        amount: faker.finance.amount(100, 1000, 2),
        date: moment(faker.date.past()).unix(),
        user: faker.helpers.arrayElement(users[1])._id,
    }))

    const reponses = await Promise.all(
        expenses.map((expense) => ExpenseModule.createExpense(expense))
    )
    if (reponses.some((res) => res[0] !== 201)) {
        throw 'Failed to create expense'
    }
}

async function down() {
    await ExpenseModule.deleteExpenses()
}

module.exports = { up, down }
