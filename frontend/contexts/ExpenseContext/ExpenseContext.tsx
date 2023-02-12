import moment from 'moment'
import React, { useMemo, useState } from 'react'
import * as ExpensesAPI from '../../apis/ExpenseAPI'
import { useAppContext } from '../AppContext/AppContext'
import * as Types from './types'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ExpenseContext = React.createContext<Types.Context | any>({})

const ExpenseContextProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const AppContext = useAppContext()
    const [expenses, setExpenses] = useState<Types.Expense[] | null>(null)
    const [selectedExpense, setSelectedExpense] =
        useState<Types.Expense | null>(null)
    const [draftExpense, setDraftExpense] = useState<Types.AddEditExpenseDoc>({
        name: '',
        description: '',
        date: moment().unix(),
        amount: 0,
    })

    const createExpense: Types.CreateExpense = async (expenseDoc) => {
        const key = 'add-expense'

        AppContext.addLoading(key)
        const response = await ExpensesAPI.createExpense(expenseDoc)
        AppContext.removeLoading(key)

        if (!response[0]) {
            AppContext.addNotification({
                title: 'Something went wrong.',
                type: 'danger',
                body: 'Please try again later',
            })
            return [false, response[1].data]
        }

        setExpenses((prev) => [response[1], ...(prev || [])])
        return [true, response[1]]
    }

    const updateExpense: Types.UpdateExpense = async (id, expenseDoc) => {
        const key = 'update-expense'

        AppContext.addLoading(key)
        const response = await ExpensesAPI.updateExpense(id, expenseDoc)
        AppContext.removeLoading(key)

        if (!response[0]) {
            return [false, response[1].data]
        }

        // update expenses
        setExpenses((prev) =>
            (prev || []).map((expense) => {
                if (expense.id !== id) return expense
                return response[1]
            })
        )

        // update current expense details
        if (id === selectedExpense?.id) {
            setSelectedExpense(response[1])
        }

        return [true, response[1]]
    }

    const listExpenses: Types.ListExpenses = async () => {
        const key = 'list-expenses'

        AppContext.addLoading(key)
        const response = await ExpensesAPI.listExpenses()
        AppContext.removeLoading(key)

        if (!response[0]) {
            AppContext.addNotification({
                title: 'Something went wrong.',
                type: 'danger',
                body: 'Please try again later',
            })
            return response
        }

        setExpenses(response[1])
        return response
    }

    const deleteExpense: Types.DeleteExpense = async (id) => {
        const key = 'delete-expense'

        AppContext.addLoading(key)
        const response = await ExpensesAPI.deleteExpense(id)
        AppContext.removeLoading(key)

        if (!response[0]) {
            AppContext.addNotification({
                title: 'Something went wrong.',
                type: 'danger',
                body: 'Please try again later',
            })
            return response
        }

        setExpenses((prev) =>
            (prev || []).filter((expense) => expense.id !== id)
        )
        return response
    }

    const value: Types.Context = useMemo(
        () => ({
            expenses,
            selectedExpense,
            deleteExpense,
            draftExpense,
            setDraftExpense,
            createExpense,
            updateExpense,
            listExpenses,
            setSelectedExpense,
        }),
        [expenses, selectedExpense, draftExpense]
    )

    return (
        <ExpenseContext.Provider value={value}>
            {children}
        </ExpenseContext.Provider>
    )
}

const useExpenseContext = () => React.useContext<Types.Context>(ExpenseContext)

export { ExpenseContext, ExpenseContextProvider, useExpenseContext }
