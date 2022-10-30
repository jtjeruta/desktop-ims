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
        .catch((err): [false, string] => [false, err.response?.message])

export const getVendor = (vendorId: string) =>
    Axios()
        .get(`/api/v1/vendors/${vendorId}`)
        .then((response): [true, Types.Vendor] => [true, response.data.vendor])
        .catch((err): [false, string] => [false, err.response?.message])

export const createVendor = (data: Types.AddEditVendorDoc) =>
    Axios()
        .post('/api/v1/vendors', data)
        .then((response): [true, Types.Vendor] => [true, response.data.vendor])
        .catch((err): [false, AxiosResponse] => [false, err.response])

export const updateVendor = (id: string, data: Types.AddEditVendorDoc) =>
    Axios()
        .put(`/api/v1/vendors/${id}`, data)
        .then((response): [true, Types.Vendor] => [true, response.data.vendor])
        .catch((err): [false, AxiosResponse] => [false, err.response])
