import { useEffect, useState } from 'react'
import Button from '../../components/Button/Button'
import Card from '../../components/Card/Card'
import Table from '../../components/Table/Table'
import UserLayout from '../../components/UserLayout/UserLayout'
import { useAppContext } from '../../contexts/AppContext/AppContext'
import {
    ExpenseContextProvider,
    useExpenseContext,
} from '../../contexts/ExpenseContext/ExpenseContext'
import { Expense } from '../../contexts/ExpenseContext/types'
import { escapeRegExp, formatCurrency } from '../../utils'
import AddEditExpenseDialog from '../../components/AddEditExpenseDialog/AddEditExpenseDialog'
import SearchBar from '../../components/SearchBar/SearchBar'
import { formatDate } from '../../utils/date-utils'
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog'
import { useRouter } from 'next/router'
import { ActionButton } from '../../components/ActionButton/ActionButton'

const ExpensesPageContent = () => {
    const AppContext = useAppContext()
    const ExpenseContext = useExpenseContext()
    const [search, setSearch] = useState<string>('')
    const [page, setPage] = useState<number>(0)
    const router = useRouter()

    const filteredExpenses = (ExpenseContext.expenses || []).filter(
        (expense) => {
            const regex = new RegExp(escapeRegExp(search), 'igm')
            return [
                expense.name,
                expense.description,
                `${expense.amount}`,
            ].some((item) => regex.test(`${item}`))
        }
    )

    const handleOpenExpenseDialog = (expense: Expense | null) => () => {
        ExpenseContext.setSelectedExpense(expense)
        AppContext.openDialog('add-edit-expense-dialog')
    }

    useEffect(() => {
        async function init() {
            const responses = await Promise.all([ExpenseContext.listExpenses()])
            if (responses.some((response) => !response[0]))
                return router.push('/500')
        }

        init()
    }, [])

    return (
        <UserLayout>
            <div className="flex justify-end mb-4 gap-3">
                <SearchBar
                    onSearch={(search) => {
                        setSearch(search)
                        setPage(0)
                    }}
                    inputClass="!text-base h-full !bg-white"
                />
                <Button
                    onClick={handleOpenExpenseDialog(null)}
                    className="hidden md:block"
                >
                    Add Expenses
                </Button>
            </div>

            <Card bodyClsx="!px-0 !py-0 overflow-x-auto">
                <Table
                    page={page}
                    handlePageChange={(newPage) => setPage(newPage)}
                    rows={filteredExpenses}
                    loading={AppContext.isLoading('list-expenses')}
                    columns={[
                        {
                            title: 'Date',
                            format: (row) => {
                                const expense = row as Expense
                                return formatDate(expense.date, true)
                            },
                            sort: (expense) => expense.date,
                            bodyClsx: 'align-top',
                        },
                        {
                            title: 'Name',
                            format: (row) => {
                                const expense = row as Expense
                                return (
                                    <div
                                        className="hover:text-teal-600 cursor-pointer"
                                        onClick={handleOpenExpenseDialog(
                                            expense
                                        )}
                                    >
                                        {expense.name}
                                    </div>
                                )
                            },
                            sort: (expense) => expense.name,
                            bodyClsx: 'align-top',
                        },
                        {
                            title: 'Description',
                            format: (row) => {
                                const expense = row as Expense
                                return (
                                    <div className="truncate overflow-x-hidden">
                                        {expense.description}
                                    </div>
                                )
                            },
                            bodyClsx: 'max-w-xs',
                            sort: (expense) => expense.description,
                        },
                        {
                            title: 'Amount',
                            format: (row) => {
                                const expense = row as Expense
                                return expense.amount
                            },
                            bodyClsx: 'max-w-xs',
                            sort: (expense) => formatCurrency(expense.amount),
                        },
                        {
                            title: ' ',
                            bodyClsx: 'w-0 align-top',
                            format: (row) => {
                                const expense = row as Expense
                                return (
                                    <div className="flex">
                                        <Button
                                            style="link"
                                            onClick={() => {
                                                ExpenseContext.setSelectedExpense(
                                                    expense
                                                )
                                                AppContext.openDialog(
                                                    'add-edit-expense-dialog'
                                                )
                                            }}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            style="link"
                                            onClick={() => {
                                                ExpenseContext.setSelectedExpense(
                                                    expense
                                                )
                                                AppContext.openDialog(
                                                    'delete-expense-dialog'
                                                )
                                            }}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                )
                            },
                        },
                    ]}
                />
            </Card>
            <AddEditExpenseDialog />
            <ConfirmDialog
                dialogKey="delete-expense-dialog"
                text="Delete expense?"
                onConfirm={async () => {
                    if (!ExpenseContext.selectedExpense) return
                    const response = await ExpenseContext.deleteExpense(
                        ExpenseContext.selectedExpense.id
                    )
                    AppContext.closeDialog()

                    if (!response[0]) {
                        AppContext.addNotification({
                            title: `Something went wrong. Please try again later.`,
                            type: 'danger',
                        })
                    } else {
                        AppContext.addNotification({
                            title: `Expense deleted successfully.`,
                            type: 'success',
                        })
                    }
                }}
                loading={AppContext.isLoading('delete-expense')}
            />
            <ActionButton onClick={handleOpenExpenseDialog(null)} />
        </UserLayout>
    )
}

const ExpensesPage = () => {
    return (
        <ExpenseContextProvider>
            <ExpensesPageContent />
        </ExpenseContextProvider>
    )
}

export default ExpensesPage
