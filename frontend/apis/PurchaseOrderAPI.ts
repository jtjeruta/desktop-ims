import { AxiosResponse } from 'axios'
import {
    AddEditPurchaseOrderDoc,
    PurchaseOrder,
} from '../contexts/PurchaseOrderContext/types'
import Axios from './AxiosAPI'

export const listPurchaseOrders = () =>
    Axios()
        .get('/api/v1/purchase-orders')
        .then((response): [true, PurchaseOrder[]] => [
            true,
            response.data.orders,
        ])
        .catch((err): [false, string] => [false, err.response.message])

export const getPurchaseOrder = (id: string) =>
    Axios()
        .get(`/api/v1/purchase-orders/${id}`)
        .then((response): [true, PurchaseOrder] => [true, response.data.order])
        .catch((err): [false, AxiosResponse] => [false, err.response])

export const createPurchaseOrder = (data: AddEditPurchaseOrderDoc) =>
    Axios()
        .post('/api/v1/purchase-orders', data)
        .then((response): [true, PurchaseOrder] => [true, response.data.order])
        .catch((err): [false, AxiosResponse] => [false, err.response])

export const updatePurchaseOrder = (
    id: string,
    data: AddEditPurchaseOrderDoc
) =>
    Axios()
        .put(`/api/v1/purchase-orders/${id}`, data)
        .then((response): [true, PurchaseOrder] => [true, response.data.order])
        .catch((err): [false, AxiosResponse] => [false, err.response])

export const deletePurchaseOrder = (id: string) =>
    Axios()
        .delete(`/api/v1/purchase-orders/${id}`)
        .then((): [true] => [true])
        .catch((err): [false, AxiosResponse] => [false, err.response])
