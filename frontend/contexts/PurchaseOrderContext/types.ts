import { AxiosResponse } from 'axios'
import { Product } from '../ProductContext/types'

export type Vendor = {
    id: string
    name: string
    phone: string
    address: string
}

export type PurchaseOrder = {
    id: string
    products: {
        product: Product
        quantity: number
        itemPrice: number
        totalPrice: number
    }[]
    createdAt: number
    vendor: Vendor
    total: number
}

export type CreateUpdatePurchaseOrderDoc = {
    products: {
        product: string
        quantity: number
        itemPrice: number
    }[]
    vendor: string
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
    createOrder: CreatePurchaseOrder
    updateOrder: UpdatePurchaseOrder
    listOrders: ListPurchaseOrders
    getOrder: GetPurchaseOrder
}
