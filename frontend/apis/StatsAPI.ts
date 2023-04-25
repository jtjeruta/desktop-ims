import { CostReport, SalesReport } from '../contexts/StatsContext/types'
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

export const getTotalExpenses = (startDate: number, endDate: number) =>
    Axios()
        .get(
            `/api/v1/stats/total-expenses?startDate=${startDate}&endDate=${endDate}`
        )
        .then((response): [true, number] => [true, response.data.totalExpenses])
        .catch((err): [false, string] => [false, err.response?.message])

export const getTotalReceivables = (startDate: number, endDate: number) =>
    Axios()
        .get(
            `/api/v1/stats/total-receivables?startDate=${startDate}&endDate=${endDate}`
        )
        .then((response): [true, number] => [
            true,
            response.data.totalReceivables,
        ])
        .catch((err): [false, string] => [false, err.response?.message])

export const listSalesReports = (startDate: number, endDate: number) =>
    Axios()
        .get(
            `/api/v1/stats/sales-reports?startDate=${startDate}&endDate=${endDate}`
        )
        .then((response): [true, SalesReport[]] => [
            true,
            response.data.salesReports,
        ])
        .catch((err): [false, string] => [false, err.response?.message])

export const listCostReports = (startDate: number, endDate: number) =>
    Axios()
        .get(
            `/api/v1/stats/purchase-reports?startDate=${startDate}&endDate=${endDate}`
        )
        .then((response): [true, CostReport[]] => [
            true,
            response.data.purchaseReports,
        ])
        .catch((err): [false, string] => [false, err.response?.message])
