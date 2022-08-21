import { AxiosResponse } from 'axios'
import { Product, Warehouse } from '../ProductContext/types'
import { Vendor } from '../VendorContext/types'

export type PurchaseOrder = {
    id: string
    products: {
        id: string
        product: Product
        quantity: number
        itemPrice: number
        totalPrice: number
    }[]
    createdAt: number
    vendor: Vendor
    warehouse: Warehouse | null
    total: number
}

export type DraftPurchaseOrder = {
    products: {
        id: string
        product: Product
        quantity: number
        itemPrice: number
        totalPrice: number
    }[]
    vendor: Vendor | null
    warehouse: Warehouse | null
    total: number
}

export type CreateUpdatePurchaseOrderDoc = {
    products: {
        product: string
        quantity: number
        itemPrice: number
    }[]
    vendor: string
    warehouse: string | null
}

export type CreateUpdatePurchaseOrderErrors = {
    products?: { message: string }
    vendor?: { message: string }
}

export type CreatePurchaseOrder = (
    order: CreateUpdatePurchaseOrderDoc
) => Promise<
    | [true, PurchaseOrder]
    | [false, { message: string; errors?: CreateUpdatePurchaseOrderErrors }]
>

export type UpdatePurchaseOrder = (
    id: string,
    order: CreateUpdatePurchaseOrderDoc
) => Promise<
    | [true, PurchaseOrder]
    | [false, { message: string; errors?: CreateUpdatePurchaseOrderErrors }]
>
export type ListPurchaseOrders = () => Promise<void>
export type GetPurchaseOrder = (
    id: string
) => Promise<[true, PurchaseOrder] | [false, AxiosResponse]>

export type Context = {
    orders: PurchaseOrder[] | null
    selectedOrder: PurchaseOrder | null
    draftOrder: DraftPurchaseOrder
    setDraftOrder: React.Dispatch<React.SetStateAction<DraftPurchaseOrder>>
    createOrder: CreatePurchaseOrder
    updateOrder: UpdatePurchaseOrder
    listOrders: ListPurchaseOrders
    getOrder: GetPurchaseOrder
}
