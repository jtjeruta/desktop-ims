import React, { useMemo, useState } from 'react'
import * as SalesOrdersAPI from '../../apis/SalesOrderAPI'
import { useAppContext } from '../AppContext/AppContext'
import * as Types from './types'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SalesOrderContext = React.createContext<Types.Context | any>({})

const SalesOrderContextProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const AppContext = useAppContext()
    const [orders, setOrders] = useState<Types.SalesOrder[] | null>(null)
    const [selectedOrder, setSelectedOrder] = useState<Types.SalesOrder | null>(
        null
    )
    const [draftOrder, setDraftOrder] = useState<Types.DraftSalesOrder>({
        products: [],
        customer: null,
        total: 0,
        remarks: null,
        orderDate: null,
        invoiceNumber: null,
    })

    const createOrder: Types.CreateSalesOrder = async (salesOrderDoc) => {
        const key = 'add-sales-order'

        AppContext.addLoading(key)
        const response = await SalesOrdersAPI.createSalesOrder(salesOrderDoc)
        AppContext.removeLoading(key)

        if (!response[0]) {
            AppContext.addNotification({
                title: 'Something went wrong.',
                type: 'danger',
                body: 'Please try again later',
            })
            return [false, response[1].data]
        }

        AppContext.addNotification({
            title: 'Order created!',
            type: 'success',
        })

        setOrders((prev) => [...(prev || []), response[1]])
        return [true, response[1]]
    }

    const updateOrder: Types.UpdateSalesOrder = async (id, salesOrderDoc) => {
        const key = 'update-sales-order'

        AppContext.addLoading(key)
        const response = await SalesOrdersAPI.updateSalesOrder(
            id,
            salesOrderDoc
        )
        AppContext.removeLoading(key)

        if (!response[0]) {
            AppContext.addNotification({
                title: 'Something went wrong.',
                type: 'danger',
                body: 'Please try again later',
            })
            return [false, response[1].data]
        }

        // update orders
        setOrders((prev) =>
            (prev || []).map((salesOrder) => {
                if (salesOrder.id !== id) return salesOrder
                return response[1]
            })
        )

        if (id === selectedOrder?.id) {
            setSelectedOrder(response[1])
        }

        AppContext.addNotification({
            title: 'Order updated!',
            type: 'success',
        })

        return [true, response[1]]
    }

    const listOrders: Types.ListSalesOrders = async () => {
        const key = 'list-sales-orders'

        AppContext.addLoading(key)
        const response = await SalesOrdersAPI.listSalesOrders()
        AppContext.removeLoading(key)

        if (!response[0]) {
            AppContext.addNotification({
                title: 'Something went wrong.',
                type: 'danger',
                body: 'Please try again later',
            })
            return
        }

        setOrders(response[1])
    }

    const getOrder: Types.GetSalesOrder = async (id) => {
        const key = 'get-sales-order'

        AppContext.addLoading(key)
        const response = await SalesOrdersAPI.getSalesOrder(id)
        AppContext.removeLoading(key)

        if (!response[0]) {
            return response
        }

        setSelectedOrder(response[1])
        return response
    }

    const value: Types.Context = useMemo(
        () => ({
            orders,
            selectedOrder,
            draftOrder,
            createOrder,
            updateOrder,
            listOrders,
            getOrder,
            setSelectedOrder,
            setDraftOrder,
        }),
        [orders, selectedOrder, draftOrder]
    )

    return (
        <SalesOrderContext.Provider value={value}>
            {children}
        </SalesOrderContext.Provider>
    )
}

const useSalesOrderContext = () =>
    React.useContext<Types.Context>(SalesOrderContext)

export { SalesOrderContext, SalesOrderContextProvider, useSalesOrderContext }
