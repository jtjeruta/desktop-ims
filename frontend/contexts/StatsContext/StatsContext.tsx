import React, { useMemo, useState } from 'react'
import * as StatsAPI from '../../apis/StatsAPI'
import { useAppContext } from '../AppContext/AppContext'
import * as Types from './types'

const StatContext = React.createContext<Types.Context | any>({})

const StatContextProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const AppContext = useAppContext()
    const [topProductSales, setTopProductSales] = useState<
        Types.ProductSale[] | null
    >(null)

    const listTopProductSales = async () => {
        const key = 'list-top-product-sales'

        AppContext.addLoading(key)
        const response = await StatsAPI.listTopProductSales()
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

    const value: Types.Context = useMemo(
        () => ({
            topProductSales,
            listTopProductSales,
        }),
        [topProductSales]
    )

    return <StatContext.Provider value={value}>{children}</StatContext.Provider>
}

const useStatContext = () => React.useContext<Types.Context>(StatContext)

export { StatContext, StatContextProvider, useStatContext }
