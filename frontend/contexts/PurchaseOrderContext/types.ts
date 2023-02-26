import { AxiosResponse } from 'axios'
import { Product } from '../ProductContext/types'
import { Vendor } from '../VendorContext/types'
import { Warehouse } from '../WarehouseContext/types'

export type PurchaseOrder = {
    id: string
    products: {
        id: string
        product: Product
        quantity: number
        itemPrice: number
        totalPrice: number
        warehouse: Warehouse | null
        variant: {
            name: string
            quantity: number
        } | null
    }[]
    createdAt: number
    vendor: Vendor
    total: number
    remarks: string | null
    orderDate: number | null
    invoiceNumber: string | null
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
        variant: {
            name: string
            quantity: number
        } | null
    }[]
    vendor: Vendor | null
    total: number
    remarks: string | null
    orderDate: number | null
    invoiceNumber: string | null
}

export type AddEditPurchaseOrderDoc = {
    products: {
        product: string
        quantity: number
        itemPrice: number
        warehouse: string | null
        variant: {
            name: string
            quantity: number
        } | null
    }[]
    vendor: string
    remarks: string | null
    orderDate: number | null
    invoiceNumber: string | null
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
export type ListPurchaseOrders = () => Promise<
    [true, PurchaseOrder[]] | [false, string]
>
export type GetPurchaseOrder = (
    id: string
) => Promise<[true, PurchaseOrder] | [false, AxiosResponse]>
export type DeletePurchaseOrder = (
    id: string
) => Promise<[true] | [false, AxiosResponse]>

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
    deleteOrder: DeletePurchaseOrder
}
