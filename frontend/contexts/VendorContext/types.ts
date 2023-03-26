import { AxiosResponse } from 'axios'

export type Vendor = {
    id: string
    name: string
    email: string
    phone: string
    address: string
    remarks: string
}

export type AddEditVendorDoc = {
    id?: string
    name: string
    email: string
    phone: string
    address: string
    remarks: string
}

export type CreateUpdateVendorErrors = Record<keyof Vendor, { message: string }>

export type CreateVendor = (
    vendor: AddEditVendorDoc
) => Promise<
    | [true, Vendor]
    | [false, { message: string; errors?: CreateUpdateVendorErrors }]
>
export type UpdateVendor = (
    id: string,
    vendor: AddEditVendorDoc
) => Promise<
    | [true, Vendor]
    | [false, { message: string; errors?: CreateUpdateVendorErrors }]
>

export type ListVendors = (includeArchived?: boolean) => Promise<[true, Vendor[]] | [false, string]>
export type GetVendor = (
    id: Vendor['id']
) => Promise<[true, Vendor] | [false, AxiosResponse]>
export type DeleteVendor = (
    id: Vendor['id']
) => Promise<[true] | [false, AxiosResponse]>

export type Context = {
    vendors: Vendor[] | null
    selectedVendor: Vendor | null
    draftVendor: AddEditVendorDoc
    createVendor: CreateVendor
    updateVendor: UpdateVendor
    listVendors: ListVendors
    setSelectedVendor: (vendor: Vendor | null) => void
    setDraftVendor: React.Dispatch<React.SetStateAction<AddEditVendorDoc>>
    deleteVendor: DeleteVendor
}
