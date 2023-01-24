import { AxiosResponse } from 'axios'
import * as Types from '../contexts/ExpenseContext/types'
import Axios from './AxiosAPI'

export const listExpenses = () =>
    Axios()
        .get('/api/v1/expenses')
        .then((response): [true, Types.Expense[]] => [
            true,
            response.data.expenses,
        ])
        .catch((err): [false, string] => [false, err.response?.message])

export const getExpense = (expenseId: string) =>
    Axios()
        .get(`/api/v1/expenses/${expenseId}`)
        .then((response): [true, Types.Expense] => [
            true,
            response.data.expense,
        ])
        .catch((err): [false, string] => [false, err.response?.message])

export const createExpense = (data: Types.AddEditExpenseDoc) =>
    Axios()
        .post('/api/v1/expenses', data)
        .then((response): [true, Types.Expense] => [
            true,
            response.data.expense,
        ])
        .catch((err): [false, AxiosResponse] => [false, err.response])

export const updateExpense = (id: string, data: Types.AddEditExpenseDoc) =>
    Axios()
        .put(`/api/v1/expenses/${id}`, data)
        .then((response): [true, Types.Expense] => [
            true,
            response.data.expense,
        ])
        .catch((err): [false, AxiosResponse] => [false, err.response])

export const deleteExpense = (id: string) =>
    Axios()
        .delete(`/api/v1/expenses/${id}`)
        .then((): [true] => [true])
        .catch((err): [false, AxiosResponse] => [false, err.response])
