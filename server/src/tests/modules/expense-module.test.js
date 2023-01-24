const { expect } = require('chai')

const ExpensesModule = require('../../modules/expenses-module')
const setup = require('../setup')
const testdata = require('../testdata')

describe('Module: Create Expense', () => {
    setup()

    it('Success: create expense using correct data', async () => {
        const createdExpense = await ExpensesModule.createExpense({
            ...testdata.expense1,
            user: '5f9f1c9b9c9c9c9c9c9c9c9c',
        })

        expect(createdExpense[0]).to.equal(201)
        expect(createdExpense[1].name).to.equal(testdata.expense1.name)
        expect(createdExpense[1].phone).to.equal(testdata.expense1.phone)
        expect(createdExpense[1].email).to.equal(testdata.expense1.email)
        expect(createdExpense[1].address).to.equal(testdata.expense1.address)
    })

    it('Fail: create expense using invalid data', async () => {
        const createdExpense = await ExpensesModule.createExpense({})
        expect(createdExpense[0]).to.equal(400)
        expect(createdExpense[1].errors.name.message).to.equal(
            'Path `name` is required.'
        )
    })
})

describe('Module: List Expenses', () => {
    setup()

    it('Success: list all expenses', async () => {
        await ExpensesModule.createExpense({
            ...testdata.expense1,
            user: '5f9f1c9b9c9c9c9c9c9c9c9c',
        })
        await ExpensesModule.createExpense({
            ...testdata.expense2,
            user: '5f9f1c9b9c9c9c9c9c9c9c9c',
        })
        const expenses = await ExpensesModule.listExpenses()
        expect(expenses[0]).to.equal(200)
        expect(expenses[1].length).to.equal(2)
    })
})

describe('Module: Get Expense by id', () => {
    setup()

    it('Success: given correct id', async () => {
        const createdExpense = await ExpensesModule.createExpense({
            ...testdata.expense1,
            user: '5f9f1c9b9c9c9c9c9c9c9c9c',
        })

        const foundExpense = await ExpensesModule.getExpenseById(
            createdExpense[1]._id
        )

        expect(foundExpense[0]).to.equal(200)
        expect(foundExpense[1]._id.toString()).to.equal(
            createdExpense[1]._id.toString()
        )
    })

    it('Fail: given wrong id', async () => {
        const foundExpense = await ExpensesModule.getExpenseById(null)
        expect(foundExpense[0]).to.equal(404)
        expect(foundExpense[1]).to.deep.equal({
            message: 'Expense not found.',
        })
    })
})

describe('Module: Update Expense', () => {
    setup()

    it('Success: update expense using correct data', async () => {
        const createdExpense = await ExpensesModule.createExpense({
            ...testdata.expense1,
            user: '5f9f1c9b9c9c9c9c9c9c9c9c',
        })
        const updatedExpense = await ExpensesModule.updateExpense(
            createdExpense[1]._id,
            testdata.expense2
        )

        expect(updatedExpense[0]).to.equal(200)
        expect(updatedExpense[1].name).to.equal(testdata.expense2.name)
        expect(updatedExpense[1].email).to.equal(testdata.expense2.email)
        expect(updatedExpense[1].phone).to.equal(testdata.expense2.phone)
        expect(updatedExpense[1].address).to.equal(testdata.expense2.address)
    })

    it('Fail: update expense using invalid data', async () => {
        const createdExpense = await ExpensesModule.createExpense({
            ...testdata.expense1,
            user: '5f9f1c9b9c9c9c9c9c9c9c9c',
        })
        const updatedExpense = await ExpensesModule.updateExpense(
            createdExpense[1]._id,
            {
                name: '',
            }
        )

        expect(updatedExpense[0]).to.equal(400)
        expect(updatedExpense[1].errors.name.message).to.equal(
            'Path `name` is required.'
        )
    })
})

describe('Module: Delete Expense', () => {
    setup()

    it('Success: delete expense using correct id', async () => {
        const createdExpense = await ExpensesModule.createExpense({
            ...testdata.expense1,
            user: '5f9f1c9b9c9c9c9c9c9c9c9c',
        })
        const deletedExpense = await ExpensesModule.deleteExpense(
            createdExpense[1]._id
        )
        expect(deletedExpense[0]).to.equal(200)
        const expenses = await ExpensesModule.listExpenses()
        expect(expenses[1].length).to.equal(0)
    })
})
