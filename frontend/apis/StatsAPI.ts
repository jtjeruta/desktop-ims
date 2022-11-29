import { ProductReport } from '../contexts/StatsContext/types'
import Axios from './AxiosAPI'

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

export const getAverageSales = (startDate: number, endDate: number) =>
    Axios()
        .get(
            `/api/v1/stats/average-sales?startDate=${startDate}&endDate=${endDate}`
        )
        .then((response): [true, number] => [true, response.data.averageSales])
        .catch((err): [false, string] => [false, err.response?.message])

export const getAveragePurchases = (startDate: number, endDate: number) =>
    Axios()
        .get(
            `/api/v1/stats/average-purchases?startDate=${startDate}&endDate=${endDate}`
        )
        .then((response): [true, number] => [
            true,
            response.data.averagePurchases,
        ])
        .catch((err): [false, string] => [false, err.response?.message])

export const listProductReports = (startDate: number, endDate: number) =>
    Axios()
        .get(
            `/api/v1/stats/product-reports?startDate=${startDate}&endDate=${endDate}`
        )
        .then((response): [true, ProductReport[]] => [
            true,
            response.data.productReports,
        ])
        .catch((err): [false, string] => [false, err.response?.message])
