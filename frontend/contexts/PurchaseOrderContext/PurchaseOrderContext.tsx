import React, { useMemo, useState } from 'react'
import * as PurchaseOrdersAPI from '../../apis/PurchaseOrderAPI'
import { useAppContext } from '../AppContext/AppContext'
import * as Types from './types'

const PurchaseOrderContext = React.createContext<Types.Context | any>({})

const PurchaseOrderContextProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const AppContext = useAppContext()
    const [orders, setOrders] = useState<Types.PurchaseOrder[] | null>(null)
    const [selectedOrder, setSelectedOrder] =
        useState<Types.PurchaseOrder | null>(null)
    const [draftOrder, setDraftOrder] = useState<Types.DraftPurchaseOrder>({
        products: [],
        vendor: null,
        total: 0,
        remarks: null,
        orderDate: null,
        invoiceNumber: null,
    })

    const createOrder: Types.CreatePurchaseOrder = async (purchaseOrderDoc) => {
        const key = 'add-purchase-order'

        AppContext.addLoading(key)
        const response = await PurchaseOrdersAPI.createPurchaseOrder(
            purchaseOrderDoc
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

        AppContext.addNotification({
            title: 'Order created!',
            type: 'success',
        })

        setOrders((prev) => [...(prev || []), response[1]])
        return [true, response[1]]
    }

    const updateOrder: Types.UpdatePurchaseOrder = async (
        id,
        purchaseOrderDoc
    ) => {
        const key = 'update-purchase-order'

        AppContext.addLoading(key)
        const response = await PurchaseOrdersAPI.updatePurchaseOrder(
            id,
            purchaseOrderDoc
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
            (prev || []).map((purchaseOrder) => {
                if (purchaseOrder.id !== id) return purchaseOrder
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

    const listOrders: Types.ListPurchaseOrders = async () => {
        const key = 'list-purchase-orders'

        AppContext.addLoading(key)
        const response = await PurchaseOrdersAPI.listPurchaseOrders()
        AppContext.removeLoading(key)

        if (!response[0]) return response

        setOrders(response[1])
        return response
    }

    const getOrder: Types.GetPurchaseOrder = async (id) => {
        const key = 'get-purchase-order'

        AppContext.addLoading(key)
        const response = await PurchaseOrdersAPI.getPurchaseOrder(id)
        AppContext.removeLoading(key)

        if (!response[0]) {
            return response
        }

        setSelectedOrder(response[1])
        return response
    }

    const deleteOrder: Types.DeletePurchaseOrder = async (id) => {
        const key = 'delete-purchase-order'

        AppContext.addLoading(key)
        const response = await PurchaseOrdersAPI.deletePurchaseOrder(id)
        AppContext.removeLoading(key)

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
            deleteOrder,
        }),
        [orders, selectedOrder, draftOrder]
    )

    return (
        <PurchaseOrderContext.Provider value={value}>
            {children}
        </PurchaseOrderContext.Provider>
    )
}

const usePurchaseOrderContext = () =>
    React.useContext<Types.Context>(PurchaseOrderContext)

export {
    PurchaseOrderContext,
    PurchaseOrderContextProvider,
    usePurchaseOrderContext,
}
