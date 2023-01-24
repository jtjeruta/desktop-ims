const ExpensesModule = require('../modules/expenses-module')
const { ExpensesView, ExpenseView } = require('../views/expense-view')

module.exports.listExpenses = async (req, res) => {
    const expensesRes = await ExpensesModule.listExpenses()

    if (expensesRes[0] !== 200) {
        return res.status(expensesRes[0]).json(expensesRes[1])
    }

    return res.status(200).json({ expenses: ExpensesView(expensesRes[1]) })
}

module.exports.createExpense = async (req, res) => {
    const userId = req.con._id
    const response = await ExpensesModule.createExpense({
        ...req.body,
        user: userId,
    })

    if (response[0] !== 201) {
        return res.status(response[0]).json(response[1])
    }

    return res.status(201).json({ expense: ExpenseView(response[1]) })
}

module.exports.updateExpense = async (req, res) => {
    const { expenseId } = req.params
    const response = await ExpensesModule.updateExpense(expenseId, req.body)

    if (response[0] !== 200) {
        return res.status(response[0]).json(response[1])
    }

    return res.status(200).json({ expense: ExpenseView(response[1]) })
}

module.exports.deleteExpense = async (req, res) => {
    const { expenseId } = req.params
    const response = await ExpensesModule.deleteExpense(expenseId)
    return res.status(response[0]).json(response[1])
}
