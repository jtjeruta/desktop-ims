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
    const [topProductSales, setTopProductSales] = useState<
        Types.ProductSale[] | null
    >(null)
    const [topProductPurchases, setTopProductPurchases] = useState<
        Types.ProductSale[] | null
    >(null)

    const listTopProductSales = async () => {
        const key = 'list-top-product-sales'

        AppContext.addLoading(key)
        const response = await StatsAPI.listTopProductSales(
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

        setTopProductSales(response[1])
        return response
    }

    const listTopProductPurchases = async () => {
        const key = 'list-top-product-purchases'

        AppContext.addLoading(key)
        const response = await StatsAPI.listTopProductPurchases(
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

        setTopProductPurchases(response[1])
        return response
    }

    const value: Types.Context = useMemo(
        () => ({
            dateRange,
            setDateRange,
            topProductSales,
            topProductPurchases,
            listTopProductSales,
            listTopProductPurchases,
        }),
        [dateRange, topProductSales, topProductPurchases]
    )

    return <StatContext.Provider value={value}>{children}</StatContext.Provider>
}

const useStatContext = () => React.useContext<Types.Context>(StatContext)

export { StatContext, StatContextProvider, useStatContext }
