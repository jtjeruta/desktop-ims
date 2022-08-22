import { AxiosResponse } from 'axios'

export type Vendor = {
    id: string
    name: string
    email: string
    phone: string
    address: string
}

export type CreateVendorDoc = {
    name: string
    email: string
    phone: string
    address: string
}

export type UpdateVendorDoc = {
    name?: string
    email?: string
    phone?: string
    address?: string
}

export type CreateUpdateVendorErrors = Record<keyof Vendor, { message: string }>

export type CreateVendor = (
    vendor: CreateVendorDoc
) => Promise<
    | [true, Vendor]
    | [false, { message: string; errors?: CreateUpdateVendorErrors }]
>
export type UpdateVendor = (
    id: string,
    vendor: UpdateVendorDoc
) => Promise<
    | [true, Vendor]
    | [false, { message: string; errors?: CreateUpdateVendorErrors }]
>

export type ListVendors = () => Promise<[true, Vendor[]] | [false, string]>
export type GetVendor = (
    id: Vendor['id']
) => Promise<[true, Vendor] | [false, AxiosResponse]>

export type Context = {
    vendors: Vendor[] | null
    selectedVendor: Vendor | null
    draftVendor: CreateVendorDoc | null
    createVendor: CreateVendor
    updateVendor: UpdateVendor
    listVendors: ListVendors
    setSelectedVendor: (vendor: Vendor | null) => void
    setDraftVendor: React.Dispatch<React.SetStateAction<CreateVendorDoc | null>>
}
