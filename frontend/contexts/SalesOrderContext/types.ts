import { AxiosResponse } from 'axios'
import { Product, Warehouse } from '../ProductContext/types'
import { Customer } from '../CustomerContext/types'

export type SalesOrder = {
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
    customer: Customer
    total: number
    remarks: string | null
    orderDate: number | null
    invoiceNumber: string | null
}

export type DraftSalesOrder = {
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
    customer: Customer | null
    total: number
    remarks: string | null
    orderDate: number | null
    invoiceNumber: string | null
}

export type AddEditSalesOrderDoc = {
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
    customer: string
    remarks: string | null
    orderDate: number | null
    invoiceNumber: string | null
}

export type CreateUpdateSalesOrderErrors = {
    products?: { message: string }
    customer?: { message: string }
}

export type CreateSalesOrder = (
    order: AddEditSalesOrderDoc
) => Promise<
    | [true, SalesOrder]
    | [false, { message: string; errors?: CreateUpdateSalesOrderErrors }]
>

export type UpdateSalesOrder = (
    id: string,
    order: AddEditSalesOrderDoc
) => Promise<
    | [true, SalesOrder]
    | [false, { message: string; errors?: CreateUpdateSalesOrderErrors }]
>
export type ListSalesOrders = () => Promise<void>
export type GetSalesOrder = (
    id: string
) => Promise<[true, SalesOrder] | [false, AxiosResponse]>

export type Context = {
    orders: SalesOrder[] | null
    selectedOrder: SalesOrder | null
    draftOrder: DraftSalesOrder
    setDraftOrder: React.Dispatch<React.SetStateAction<DraftSalesOrder>>
    setSelectedOrder: React.Dispatch<React.SetStateAction<SalesOrder | null>>
    createOrder: CreateSalesOrder
    updateOrder: UpdateSalesOrder
    listOrders: ListSalesOrders
    getOrder: GetSalesOrder
}
