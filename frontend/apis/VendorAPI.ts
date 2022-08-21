import { AxiosResponse } from 'axios'
import * as Types from '../contexts/VendorContext/types'
import Axios from './AxiosAPI'

export const listVendors = () =>
    Axios()
        .get('/api/v1/vendors')
        .then((response): [true, Types.Vendor[]] => [
            true,
            response.data.vendors,
        ])
        .catch((err): [false, string] => [false, err.response.data.message])

export const createVendor = (data: Types.CreateVendorDoc) =>
    Axios()
        .post('/api/v1/vendors', data)
        .then((response): [true, Types.Vendor] => [true, response.data.vendor])
        .catch((err): [false, AxiosResponse] => [false, err.response])

export const updateVendor = (id: string, data: Types.UpdateVendorDoc) =>
    Axios()
        .post(`/api/v1/vendors/${id}`, data)
        .then((response): [true, Types.Vendor] => [true, response.data.vendor])
        .catch((err): [false, AxiosResponse] => [false, err.response])
