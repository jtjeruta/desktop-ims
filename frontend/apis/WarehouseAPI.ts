import { AxiosResponse } from 'axios'
import {
    AddEditWarehouseDoc,
    Warehouse,
} from '../contexts/WarehouseContext/types'
import Axios from './AxiosAPI'

export const listWarehouses = () =>
    Axios()
        .get(`/api/v1/warehouses`)
        .then((response): [true, Warehouse[]] => [
            true,
            response.data.warehouses,
        ])
        .catch((err): [false, AxiosResponse] => [false, err.response])

export const createWarehouse = (data: AddEditWarehouseDoc) =>
    Axios()
        .post(`/api/v1/warehouses`, data)
        .then((response): [true, Warehouse] => [true, response.data.warehouse])
        .catch((err): [false, AxiosResponse] => [false, err.response])

export const updateWarehouse = (
    warehouseId: string,
    data: AddEditWarehouseDoc
) =>
    Axios()
        .put(`/api/v1/warehouses/${warehouseId}`, data)
        .then((response): [true, Warehouse] => [true, response.data.warehouse])
        .catch((err): [false, AxiosResponse] => [false, err.response])

export const deleteWarehouse = (warehouseId: string) =>
    Axios()
        .delete(`/api/v1/warehouses/${warehouseId}`)
        .then((): [true] => [true])
        .catch((err): [false, string] => [false, err.response?.message])
