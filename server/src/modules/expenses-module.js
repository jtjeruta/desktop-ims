const moment = require('moment')
const { getMongoError } = require('../lib/mongo-errors')
const { ExpenseModel } = require('../schemas/expense-schema')

module.exports.createExpense = async (data, session = null) => {
    const doc = {
        ...data,
        createdAt: moment().unix(),
        modifiedAt: moment().unix(),
    }

    const expense = new ExpenseModel(doc)

    try {
        const createdExpense = await (session
            ? expense.save({ session })
            : expense.save())
        return [201, createdExpense]
    } catch (error) {
        console.error(error)
        console.error('Failed to create expense')
        return getMongoError(error)
    }
}

module.exports.listExpenses = async (query = {}, session = null) => {
    try {
        const expenses = await ExpenseModel.find(query)
            .sort({ date: -1 })
            .populate('user')
            .session(session)

        return [200, expenses]
    } catch (error) {
        console.error('Failed to list expenses')
        return getMongoError(error)
    }
}

module.exports.updateExpense = async (id, data, session) => {
    const doc = {
        ...data,
        modifiedAt: moment().unix(),
    }

    try {
        const updatedExpense = await ExpenseModel.findByIdAndUpdate(
            { _id: id },
            { $set: doc },
            { new: true, runValidators: true, session }
        )
        return [200, updatedExpense]
    } catch (error) {
        console.error('Failed to update expense')
        return getMongoError(error)
    }
}

module.exports.getExpenseById = async (id, session) => {
    try {
        const expense = await ExpenseModel.findById(id)
            .populate('user')
            .session(session)

        if (!expense) return [404, { message: 'Expense not found.' }]
        return [200, expense]
    } catch (error) {
        console.error('Failed to get expense by id')
        return getMongoError(error)
    }
}

module.exports.deleteExpense = async (id, session = null) => {
    try {
        await ExpenseModel.findByIdAndDelete(id).session(session)
        return [200]
    } catch (error) {
        console.error('Failed to delete expense')
        return getMongoError(error)
    }
}

module.exports.deleteExpenses = async (query = {}, session) => {
    try {
        await ExpenseModel.deleteMany(query).session(session)
        return [200]
    } catch (error) {
        console.error('Failed to delete expenses')
        return getMongoError(error)
    }
}
