import React, { useMemo, useState } from 'react'
import * as PurchaseOrdersAPI from '../../apis/PurchaseOrderAPI'
import { useAppContext } from '../AppContext/AppContext'
import {
    CreatePurchaseOrder,
    Context,
    PurchaseOrder,
    ListPurchaseOrders,
    UpdatePurchaseOrder,
} from './types'

const PurchaseOrderContext = React.createContext<Context | any>({})

const PurchaseOrderContextProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const AppContext = useAppContext()
    const [orders, setOrders] = useState<PurchaseOrder[] | null>(null)
    const [selectedOrder, setSelectedOrder] = useState<PurchaseOrder | null>(
        null
    )

    const createOrder: CreatePurchaseOrder = async (purchaseOrderDoc) => {
        const key = 'add-purchase-order'

        AppContext.addLoading(key)
        const response = await PurchaseOrdersAPI.createPurchaseOrder(
            purchaseOrderDoc
        )
        AppContext.removeLoading(key)

        if (!response[0]) {
            return [false, response[1].data]
        }

        setOrders((prev) => [...(prev || []), response[1]])
        return [true, response[1]]
    }

    const updateOrder: UpdatePurchaseOrder = async (id, purchaseOrderDoc) => {
        const key = 'update-purchase-order'

        AppContext.addLoading(key)
        const response = await PurchaseOrdersAPI.updatePurchaseOrder(
            id,
            purchaseOrderDoc
        )
        AppContext.removeLoading(key)

        if (!response[0]) {
            return [false, response[1].data]
        }

        // update orders
        setOrders((prev) =>
            (prev || []).map((purchaseOrder) => {
                if (purchaseOrder.id !== id) return purchaseOrder
                return response[1]
            })
        )

        if (id === selectedOrder?.id) {
            setSelectedOrder(response[1])
        }

        return [true, response[1]]
    }

    const listOrders: ListPurchaseOrders = async () => {
        const key = 'list-purchase-orders'

        AppContext.addLoading(key)
        const response = await PurchaseOrdersAPI.listPurchaseOrders()
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

    const value: Context = useMemo(
        () => ({
            orders,
            selectedOrder,
            createOrder,
            updateOrder,
            listOrders,
        }),
        [orders, selectedOrder]
    )

    return (
        <PurchaseOrderContext.Provider value={value}>
            {children}
        </PurchaseOrderContext.Provider>
    )
}

const usePurchaseOrderContext = () =>
    React.useContext<Context>(PurchaseOrderContext)

export {
    PurchaseOrderContext,
    PurchaseOrderContextProvider,
    usePurchaseOrderContext,
}
