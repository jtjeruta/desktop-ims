import { AxiosResponse } from 'axios'
import {
    AddEditSalesOrderDoc,
    SalesOrder,
} from '../contexts/SalesOrderContext/types'
import Axios from './AxiosAPI'

export const listSalesOrders = () =>
    Axios()
        .get('/api/v1/sales-orders')
        .then((response): [true, SalesOrder[]] => [true, response.data.orders])
        .catch((err): [false, string] => [false, err.response?.message])

export const getSalesOrder = (id: string) =>
    Axios()
        .get(`/api/v1/sales-orders/${id}`)
        .then((response): [true, SalesOrder] => [true, response.data.order])
        .catch((err): [false, AxiosResponse] => [false, err.response])

export const createSalesOrder = (data: AddEditSalesOrderDoc) =>
    Axios()
        .post('/api/v1/sales-orders', data)
        .then((response): [true, SalesOrder] => [true, response.data.order])
        .catch((err): [false, AxiosResponse] => [false, err.response])

export const updateSalesOrder = (id: string, data: AddEditSalesOrderDoc) =>
    Axios()
        .put(`/api/v1/sales-orders/${id}`, data)
        .then((response): [true, SalesOrder] => [true, response.data.order])
        .catch((err): [false, AxiosResponse] => [false, err.response])

export const deleteSalesOrder = (id: string) =>
    Axios()
        .delete(`/api/v1/sales-orders/${id}`)
        .then((): [true] => [true])
        .catch((err): [false, AxiosResponse] => [false, err.response])
