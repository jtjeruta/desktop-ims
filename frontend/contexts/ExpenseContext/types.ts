import { AxiosResponse } from 'axios'

export type Expense = {
    id: string
    name: string
    description: string
    date: number
    amount: number
}

export type AddEditExpenseDoc = {
    id?: string
    name: string
    description: string
    date: number
    amount: number
}

export type CreateUpdateExpenseErrors = Record<
    keyof Expense,
    { message: string }
>

export type CreateExpense = (
    expense: AddEditExpenseDoc
) => Promise<
    | [true, Expense]
    | [false, { message: string; errors?: CreateUpdateExpenseErrors }]
>
export type UpdateExpense = (
    id: string,
    expense: AddEditExpenseDoc
) => Promise<
    | [true, Expense]
    | [false, { message: string; errors?: CreateUpdateExpenseErrors }]
>

export type ListExpenses = () => Promise<[true, Expense[]] | [false, string]>
export type GetExpense = (
    id: Expense['id']
) => Promise<[true, Expense] | [false, AxiosResponse]>

export type DeleteExpense = (
    id: Expense['id']
) => Promise<[true] | [false, AxiosResponse]>

export type Context = {
    expenses: Expense[] | null
    selectedExpense: Expense | null
    deleteExpense: DeleteExpense
    draftExpense: AddEditExpenseDoc
    createExpense: CreateExpense
    updateExpense: UpdateExpense
    listExpenses: ListExpenses
    setSelectedExpense: (expense: Expense | null) => void
    setDraftExpense: React.Dispatch<React.SetStateAction<AddEditExpenseDoc>>
}
