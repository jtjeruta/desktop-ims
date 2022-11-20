import Axios from './AxiosAPI'
import { ProductPurchase, ProductSale } from '../contexts/StatsContext/types'

export const listTopProductSales = (startDate: number, endDate: number) => {
    return Axios()
        .get(
            `/api/v1/stats/top-product-sales?startDate=${startDate}&endDate=${endDate}`
        )
        .then((response): [true, ProductSale[]] => [
            true,
            response.data.products,
        ])
        .catch((err): [false, string] => [false, err.response?.message])
}

export const listTopProductPurchases = (startDate: number, endDate: number) =>
    Axios()
        .get(
            `/api/v1/stats/top-product-purchases?startDate=${startDate}&endDate=${endDate}`
        )
        .then((response): [true, ProductPurchase[]] => [
            true,
            response.data.products,
        ])
        .catch((err): [false, string] => [false, err.response?.message])

export const getTotalProductSales = (startDate: number, endDate: number) =>
    Axios()
        .get(
            `/api/v1/stats/total-product-sales?startDate=${startDate}&endDate=${endDate}`
        )
        .then((response): [true, number] => [true, response.data.totalSales])
        .catch((err): [false, string] => [false, err.response?.message])

export const getTotalProductPurchases = (startDate: number, endDate: number) =>
    Axios()
        .get(
            `/api/v1/stats/total-product-purchases?startDate=${startDate}&endDate=${endDate}`
        )
        .then((response): [true, number] => [
            true,
            response.data.totalPurchases,
        ])
        .catch((err): [false, string] => [false, err.response?.message])
