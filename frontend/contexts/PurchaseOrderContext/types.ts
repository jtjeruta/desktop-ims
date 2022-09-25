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
        warehouse: Warehouse | null
    }[]
    createdAt: number
    vendor: Vendor
    total: number
    remarks: string | null
    orderDate: number | null
}

export type DraftPurchaseOrder = {
    id?: string
    products: {
        id: string
        product: Product
        quantity: number
        itemPrice: number
        totalPrice: number
        warehouse: Warehouse | null
    }[]
    vendor: Vendor | null
    total: number
    remarks: string | null
    orderDate: number | null
}

export type AddEditPurchaseOrderDoc = {
    products: {
        product: string
        quantity: number
        itemPrice: number
        warehouse: string | null
    }[]
    vendor: string
    remarks: string | null
    orderDate: number | null
}

export type CreateUpdatePurchaseOrderErrors = {
    products?: { message: string }
    vendor?: { message: string }
}

export type CreatePurchaseOrder = (
    order: AddEditPurchaseOrderDoc
) => Promise<
    | [true, PurchaseOrder]
    | [false, { message: string; errors?: CreateUpdatePurchaseOrderErrors }]
>

export type UpdatePurchaseOrder = (
    id: string,
    order: AddEditPurchaseOrderDoc
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
    setSelectedOrder: React.Dispatch<React.SetStateAction<PurchaseOrder | null>>
    createOrder: CreatePurchaseOrder
    updateOrder: UpdatePurchaseOrder
    listOrders: ListPurchaseOrders
    getOrder: GetPurchaseOrder
}
