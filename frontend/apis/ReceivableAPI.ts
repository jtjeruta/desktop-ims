import { AxiosResponse } from 'axios'
import * as Types from '../contexts/ReceivableContext/types'
import Axios from './AxiosAPI'

export const listReceivables = () =>
    Axios()
        .get('/api/v1/receivables')
        .then((response): [true, Types.Receivable[]] => [
            true,
            response.data.receivables,
        ])
        .catch((err): [false, string] => [false, err.response?.message])

export const getReceivable = (receivableId: string) =>
    Axios()
        .get(`/api/v1/receivables/${receivableId}`)
        .then((response): [true, Types.Receivable] => [
            true,
            response.data.receivable,
        ])
        .catch((err): [false, string] => [false, err.response?.message])

export const createReceivable = (data: Types.AddEditReceivableDoc) =>
    Axios()
        .post('/api/v1/receivables', data)
        .then((response): [true, Types.Receivable] => [
            true,
            response.data.receivable,
        ])
        .catch((err): [false, AxiosResponse] => [false, err.response])

export const updateReceivable = (
    id: string,
    data: Types.AddEditReceivableDoc
) =>
    Axios()
        .put(`/api/v1/receivables/${id}`, data)
        .then((response): [true, Types.Receivable] => [
            true,
            response.data.receivable,
        ])
        .catch((err): [false, AxiosResponse] => [false, err.response])

export const deleteReceivable = (id: string) =>
    Axios()
        .delete(`/api/v1/receivables/${id}`)
        .then((): [true] => [true])
        .catch((err): [false, AxiosResponse] => [false, err.response])
