import { AxiosResponse } from 'axios'

export type Customer = {
    id: string
    name: string
    email: string
    phone: string
    address: string
}

export type AddEditCustomerDoc = {
    id?: string
    name: string
    email: string
    phone: string
    address: string
}

export type CreateUpdateCustomerErrors = Record<
    keyof Customer,
    { message: string }
>

export type CreateCustomer = (
    customer: AddEditCustomerDoc
) => Promise<
    | [true, Customer]
    | [false, { message: string; errors?: CreateUpdateCustomerErrors }]
>
export type UpdateCustomer = (
    id: string,
    customer: AddEditCustomerDoc
) => Promise<
    | [true, Customer]
    | [false, { message: string; errors?: CreateUpdateCustomerErrors }]
>

export type ListCustomers = () => Promise<[true, Customer[]] | [false, string]>
export type GetCustomer = (
    id: Customer['id']
) => Promise<[true, Customer] | [false, AxiosResponse]>

export type Context = {
    customers: Customer[] | null
    selectedCustomer: Customer | null
    draftCustomer: AddEditCustomerDoc
    createCustomer: CreateCustomer
    updateCustomer: UpdateCustomer
    listCustomers: ListCustomers
    setSelectedCustomer: (customer: Customer | null) => void
    setDraftCustomer: React.Dispatch<React.SetStateAction<AddEditCustomerDoc>>
}
