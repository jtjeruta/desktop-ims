import { AxiosResponse } from 'axios'
import { CreateWarehouseDoc, Warehouse } from '../contexts/ProductContext/types'
import Axios from './AxiosAPI'

export const createWarehouse = (productId: string, data: CreateWarehouseDoc) =>
    Axios()
        .post(`/api/v1/products/${productId}/warehouses`, data)
        .then((response): [true, Warehouse] => [true, response.data.warehouse])
        .catch((err): [false, AxiosResponse] => [false, err.response])

export const deleteWarehouse = (warehouseId: string) =>
    Axios()
        .delete(`/api/v1/warehouses/${warehouseId}`)
        .then((): [true] => [true])
        .catch((err): [false, string] => [false, err.response?.message])
