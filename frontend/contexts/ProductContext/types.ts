import { AxiosResponse } from 'axios'

export type Product = {
    id: string
    name: string
    brand: string
    category: string
    subCategory: string
    price: number
    aveUnitCost: number
    createdAt: number
    sku: string
    published: boolean
    variants: Variant[]
}

export type Variant = {
    id: string
    name: string
    quantity: number
}

export type CreateProductDoc = {
    name: string
    brand: string
    category: string
    subCategory: string
    price: number
}

export type UpdateProductDoc = {
    name?: string
    brand?: string
    category?: string
    subCategory?: string
    price?: number
    published?: boolean
}

export type CreateVariantDoc = {
    name: string
    quantity: number
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

export type ListProducts = () => Promise<void>
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

export type Context = {
    products: Product[] | null
    createProduct: CreateProduct
    updateProduct: UpdateProduct
    listProducts: ListProducts
    getProduct: GetProduct
    product: Product | null
    setProduct: (product: Product | null) => void
    createVariant: CreateVariant
    deleteVariant: DeleteVariant
    variantToDelete: Variant | null
    setVariantToDelete: (variant: Variant | null) => void
}
