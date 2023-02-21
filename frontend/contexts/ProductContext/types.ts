import { AxiosResponse } from 'axios'

export type Product = {
    id: string
    name: string
    company: string
    category: string
    subCategory: string
    sellingPrice: number
    costPrice: number
    createdAt: number
    sku: string
    published: boolean
    stock: number
    reorderPoint: number
    variants: Variant[]
}

export type Variant = {
    id: string
    name: string
    quantity: number
}

export type CreateProductDoc = {
    name: string
    company: string
    category: string
    subCategory: string
    sellingPrice: number
    costPrice: number
    reorderPoint: number
    stock: number
}

export type UpdateProductDoc = {
    name?: string
    company?: string
    category?: string
    subCategory?: string
    sellingPrice?: number
    costPrice?: number
    reorderPoint?: number
    published?: boolean
}

export type CreateVariantDoc = {
    name: string
    quantity: number
}

export type CreateWarehouseDoc = {
    name: string
    quantity: number
}

export type TransferStockDoc = {
    transferFrom: string
    transferTo: string
    amount: number
}

export type TransferStockErrors = {
    message?: string
    errors: Record<keyof TransferStockDoc, { message: string }>
}

export type CreateUpdateProductErrors = Record<
    keyof Product,
    { message: string }
>

export type CreateVariantErrors = Record<keyof Variant, { message: string }>

export type CreateProduct = (
    product: CreateProductDoc
) => Promise<
    | [true, Product]
    | [false, { message: string; errors?: CreateUpdateProductErrors }]
>

export type UpdateProduct = (
    id: string,
    product: UpdateProductDoc
) => Promise<
    | [true, Product]
    | [false, { message: string; errors?: CreateUpdateProductErrors }]
>

export type ListProducts = () => Promise<[true, Product[]] | [false, string]>
export type GetProduct = (
    id: Product['id']
) => Promise<[true, Product] | [false, AxiosResponse]>

export type CreateVariant = (
    productId: string,
    data: CreateVariantDoc
) => Promise<
    [true, Variant] | [false, { message: string; errors?: CreateVariantErrors }]
>

export type DeleteVariant = (
    variantId: string
) => Promise<[true] | [false, string]>

export type DeleteWarehouse = (
    warehouseId: string
) => Promise<[true] | [false, string]>

export type TransferStock = (
    productId: string,
    doc: TransferStockDoc
) => Promise<[true, Product] | [false, TransferStockErrors]>

export type Context = {
    createProduct: CreateProduct
    createVariant: CreateVariant
    deleteVariant: DeleteVariant
    getProduct: GetProduct
    listProducts: ListProducts
    product: Product | null
    products: Product[] | null
    setProduct: (product: Product | null) => void
    setProducts: React.Dispatch<React.SetStateAction<Product[] | null>>
    setVariantToDelete: (variant: Variant | null) => void
    transferStock: TransferStock
    updateProduct: UpdateProduct
    variantToDelete: Variant | null
}
