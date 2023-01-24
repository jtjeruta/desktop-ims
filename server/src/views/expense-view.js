module.exports.ExpensesView = (expenseDocuments) => {
    return expenseDocuments.map((expenseDocument) =>
        this.ExpenseView(expenseDocument)
    )
}

module.exports.ExpenseView = (expenseDocument) => {
    return {
        id: expenseDocument._id,
        name: expenseDocument.name,
        description: expenseDocument.description,
        date: expenseDocument.date,
        amount: expenseDocument.amount,
    }
}
