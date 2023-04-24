import moment from 'moment'
import React, { useMemo, useState } from 'react'
import * as StatsAPI from '../../apis/StatsAPI'
import { useAppContext } from '../AppContext/AppContext'
import * as Types from './types'

const StatContext = React.createContext<Types.Context | any>({})

const StatContextProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const AppContext = useAppContext()
    const [dateRange, setDateRange] = useState<{
        startDate: number
        endDate: number
    }>({
        startDate: moment().startOf('month').unix(),
        endDate: moment().endOf('day').unix(),
    })
    const [totalProductSales, setTotalProductSales] = useState<number | null>(
        null
    )
    const [totalProductPurchases, setTotalProductPurchases] = useState<
        number | null
    >(null)
    const [search, setSearch] = useState<string>('')
    const [totalExpenses, setTotalExpenses] = useState<number | null>(null)
    const [totalReceivables, setTotalReceivables] = useState<number | null>(
        null
    )
    const [salesReports, setSalesReports] = useState<Types.SalesReport[]>([])
    const [costReports, setCostReports] = useState<Types.CostReport[]>([])

    const listSalesReports = async () => {
        const key = 'list-sales-reports'

        AppContext.addLoading(key)
        const response = await StatsAPI.listSalesReports(
            dateRange.startDate,
            dateRange.endDate
        )
        AppContext.removeLoading(key)

        if (!response[0]) {
            AppContext.addNotification({
                title: 'Something went wrong.',
                type: 'danger',
                body: 'Please try again later',
            })
            return response
        }

        setSalesReports(response[1])
        return response
    }

    const listCostReports = async () => {
        const key = 'list-cost-reports'

        AppContext.addLoading(key)
        const response = await StatsAPI.listCostReports(
            dateRange.startDate,
            dateRange.endDate
        )
        AppContext.removeLoading(key)

        if (!response[0]) {
            AppContext.addNotification({
                title: 'Something went wrong.',
                type: 'danger',
                body: 'Please try again later',
            })
            return response
        }

        setCostReports(response[1])
        return response
    }

    const getTotalProductSales = async () => {
        const key = 'get-total-product-sales'

        AppContext.addLoading(key)
        const response = await StatsAPI.getTotalProductSales(
            dateRange.startDate,
            dateRange.endDate
        )
        AppContext.removeLoading(key)

        if (!response[0]) {
            AppContext.addNotification({
                title: 'Something went wrong.',
                type: 'danger',
                body: 'Please try again later',
            })
            return response
        }

        setTotalProductSales(response[1])
        return response
    }

    const getTotalProductPurchases = async () => {
        const key = 'get-total-product-purchases'

        AppContext.addLoading(key)
        const response = await StatsAPI.getTotalProductPurchases(
            dateRange.startDate,
            dateRange.endDate
        )
        AppContext.removeLoading(key)

        if (!response[0]) {
            AppContext.addNotification({
                title: 'Something went wrong.',
                type: 'danger',
                body: 'Please try again later',
            })
            return response
        }

        setTotalProductPurchases(response[1])
        return response
    }

    const getTotalExpenses = async () => {
        const key = 'get-total-expenses'

        AppContext.addLoading(key)
        const response = await StatsAPI.getTotalExpenses(
            dateRange.startDate,
            dateRange.endDate
        )
        AppContext.removeLoading(key)

        if (!response[0]) {
            AppContext.addNotification({
                title: 'Something went wrong.',
                type: 'danger',
                body: 'Please try again later',
            })
            return response
        }

        setTotalExpenses(response[1])
        return response
    }

    const getTotalReceivables = async () => {
        const key = 'get-total-receivables'

        AppContext.addLoading(key)
        const response = await StatsAPI.getTotalReceivables(
            dateRange.startDate,
            dateRange.endDate
        )
        AppContext.removeLoading(key)

        if (!response[0]) {
            AppContext.addNotification({
                title: 'Something went wrong.',
                type: 'danger',
                body: 'Please try again later',
            })
            return response
        }

        setTotalReceivables(response[1])
        return response
    }

    const value: Types.Context = useMemo(
        () => ({
            costReports,
            dateRange,
            getTotalExpenses,
            getTotalProductPurchases,
            getTotalProductSales,
            listCostReports,
            listSalesReports,
            salesReports,
            search,
            setDateRange,
            setSearch,
            totalExpenses,
            totalProductPurchases,
            totalProductSales,
            getTotalReceivables,
            totalReceivables,
        }),
        [
            costReports,
            dateRange,
            salesReports,
            search,
            totalExpenses,
            totalProductSales,
            totalProductPurchases,
            totalReceivables,
        ]
    )

    return <StatContext.Provider value={value}>{children}</StatContext.Provider>
}

const useStatContext = () => React.useContext<Types.Context>(StatContext)

export { StatContext, StatContextProvider, useStatContext }
