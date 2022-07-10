import { AxiosResponse } from 'axios'
import { CreateVariantDoc, Variant } from '../contexts/ProductContext/types'
import Axios from './AxiosAPI'

export const createVariant = (productId: string, data: CreateVariantDoc) =>
    Axios()
        .post(`/api/v1/products/${productId}/variants`, data)
        .then((response): [true, Variant] => [true, response.data.variant])
        .catch((err): [false, AxiosResponse] => [false, err.response])

export const deleteVariant = (variantId: string) =>
    Axios()
        .delete(`/api/v1/variants/${variantId}`)
        .then((): [true] => [true])
        .catch((err): [false, string] => [false, err.response.message])
