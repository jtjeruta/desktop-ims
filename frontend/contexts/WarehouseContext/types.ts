import { AxiosResponse } from 'axios'
import { Product } from '../ProductContext/types'

export type WarehouseProduct = {
    source: Product
    stock: number
}

export type Warehouse = {
    id: string
    name: string
    products: WarehouseProduct[]
}

export type AddEditWarehouseDoc = {
    id?: string
    name: string
    products: WarehouseProduct[]
}

export type CreateUpdateWarehouseErrors = Record<
    keyof Warehouse,
    { message: string }
>

export type CreateWarehouse = (
    warehouse: AddEditWarehouseDoc
) => Promise<
    | [true, AddEditWarehouseDoc]
    | [false, { message: string; errors?: CreateUpdateWarehouseErrors }]
>
export type UpdateWarehouse = (
    id: string,
    warehouse: AddEditWarehouseDoc
) => Promise<
    | [true, AddEditWarehouseDoc]
    | [false, { message: string; errors?: CreateUpdateWarehouseErrors }]
>

export type ListWarehouses = () => Promise<
    [true, Warehouse[]] | [false, AxiosResponse]
>
export type GetWarehouse = (
    id: Warehouse['id']
) => Promise<[true, Warehouse] | [false, AxiosResponse]>
export type DeleteWarehouse = (
    id: Warehouse['id']
) => Promise<[true] | [false, AxiosResponse]>

export type Context = {
    createWarehouse: CreateWarehouse
    updateWarehouse: UpdateWarehouse
    listWarehouses: ListWarehouses
    selectedWarehouse: Warehouse | null
    setSelectedWarehouse: (warehouse: Warehouse | null) => void
    setWarehouses: React.Dispatch<React.SetStateAction<Warehouse[] | null>>
    warehouses: Warehouse[] | null
    deleteWarehouse: DeleteWarehouse
}
