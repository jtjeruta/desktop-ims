import { AxiosResponse } from 'axios'
import {
    CreateProductDoc,
    Product,
    TransferStockDoc,
    UpdateProductDoc,
} from '../contexts/ProductContext/types'
import Axios from './AxiosAPI'

export const listProducts = () =>
    Axios()
        .get('/api/v1/products')
        .then((response): [true, Product[]] => [true, response.data.products])
        .catch((err): [false, string] => [false, err.response.data.message])

export const getProduct = (id: string) =>
    Axios()
        .get(`/api/v1/products/${id}`)
        .then((response): [true, Product] => [true, response.data.product])
        .catch((err): [false, AxiosResponse] => [false, err.response])

export const createProduct = (data: CreateProductDoc) =>
    Axios()
        .post('/api/v1/products', data)
        .then((response): [true, Product] => [true, response.data.product])
        .catch((err): [false, AxiosResponse] => [false, err.response])

export const updateProduct = (id: string, data: UpdateProductDoc) =>
    Axios()
        .put(`/api/v1/products/${id}`, data)
        .then((response): [true, Product] => [true, response.data.product])
        .catch((err): [false, AxiosResponse] => [false, err.response])

export const transferStock = (productId: string, data: TransferStockDoc) =>
    Axios()
        .put(`/api/v1/products/${productId}/transfer-stock`, data)
        .then((response): [true, Product] => [true, response.data.product])
        .catch((err): [false, AxiosResponse] => [false, err.response])
