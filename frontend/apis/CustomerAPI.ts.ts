import { AxiosResponse } from 'axios'
import * as Types from '../contexts/CustomerContext/types'
import Axios from './AxiosAPI'

export const listCustomers = () =>
    Axios()
        .get('/api/v1/customers')
        .then((response): [true, Types.Customer[]] => [
            true,
            response.data.customers,
        ])
        .catch((err): [false, string] => [false, err.response.message])

export const getCustomer = (customerId: string) =>
    Axios()
        .get(`/api/v1/customers/${customerId}`)
        .then((response): [true, Types.Customer] => [
            true,
            response.data.customer,
        ])
        .catch((err): [false, string] => [false, err.response.message])

export const createCustomer = (data: Types.AddEditCustomerDoc) =>
    Axios()
        .post('/api/v1/customers', data)
        .then((response): [true, Types.Customer] => [
            true,
            response.data.customer,
        ])
        .catch((err): [false, AxiosResponse] => [false, err.response])

export const updateCustomer = (id: string, data: Types.AddEditCustomerDoc) =>
    Axios()
        .put(`/api/v1/customers/${id}`, data)
        .then((response): [true, Types.Customer] => [
            true,
            response.data.customer,
        ])
        .catch((err): [false, AxiosResponse] => [false, err.response])
