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

export type CreateUpdateProductErrors = Record<
    keyof Product,
    { message: string }
>

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
) => Promise<[true, Product] | [false, string]>

export type Context = {
    products: Product[] | null
    createProduct: CreateProduct
    updateProduct: UpdateProduct
    listProducts: ListProducts
    getProduct: GetProduct
    product: Product | null
    setProduct: (product: Product | null) => void
}
