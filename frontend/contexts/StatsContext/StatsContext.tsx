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
    const [averageSales, setAverageSales] = useState<number | null>(null)
    const [averagePurchases, setAveragePurchases] = useState<number | null>(
        null
    )
    const [productReports, setProductReports] = useState<
        Types.ProductReport[] | null
    >(null)
    const [search, setSearch] = useState<string>('')

    const listProductReports = async () => {
        const key = 'list-product-reports'

        AppContext.addLoading(key)
        const response = await StatsAPI.listProductReports(
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

        setProductReports(response[1])
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

    const getAverageSales = async () => {
        const key = 'get-average-sales'

        AppContext.addLoading(key)
        const response = await StatsAPI.getAverageSales(
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

        setAverageSales(response[1])
        return response
    }

    const getAveragePurchases = async () => {
        const key = 'get-average-purchases'

        AppContext.addLoading(key)
        const response = await StatsAPI.getAveragePurchases(
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

        setAveragePurchases(response[1])
        return response
    }

    const value: Types.Context = useMemo(
        () => ({
            averagePurchases,
            averageSales,
            dateRange,
            getAveragePurchases,
            getAverageSales,
            getTotalProductPurchases,
            getTotalProductSales,
            listProductReports,
            productReports,
            search,
            setDateRange,
            setSearch,
            totalProductPurchases,
            totalProductSales,
        }),
        [
            averageSales,
            averagePurchases,
            dateRange,
            productReports,
            search,
            totalProductSales,
            totalProductPurchases,
        ]
    )

    return <StatContext.Provider value={value}>{children}</StatContext.Provider>
}

const useStatContext = () => React.useContext<Types.Context>(StatContext)

export { StatContext, StatContextProvider, useStatContext }
