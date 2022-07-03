import { AxiosResponse } from 'axios'
import {
    CreateUpdateProductDoc,
    Product,
} from '../contexts/ProductContext/types'
import Axios from './AxiosAPI'

export const listProducts = () =>
    Axios()
        .get('/api/v1/products')
        .then((response): [true, Product[]] => [true, response.data.products])
        .catch((err): [false, string] => [false, err.response.message])

export const createProduct = (data: CreateUpdateProductDoc) =>
    Axios()
        .post('/api/v1/products', data)
        .then((response): [true, Product] => [true, response.data.product])
        .catch((err): [false, AxiosResponse] => [false, err.response])

export const updateProduct = (id: string, data: CreateUpdateProductDoc) =>
    Axios()
        .put(`/api/v1/products/${id}`, data)
        .then((response): [true, Product] => [true, response.data.product])
        .catch((err): [false, AxiosResponse] => [false, err.response])
