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
}

export type CreateUpdateProductDoc = {
    name: string
    brand: string
    category: string
    subCategory: string
    price: number
}

export type CreateUpdateProductErrors = Record<
    keyof CreateUpdateProductDoc,
    { message: string }
>

export type CreateProduct = (
    product: CreateUpdateProductDoc
) => Promise<
    | [true, Product]
    | [false, { message: string; errors?: CreateUpdateProductErrors }]
>

export type UpdateProduct = (
    id: string,
    product: CreateUpdateProductDoc
) => Promise<
    | [true, Product]
    | [false, { message: string; errors?: CreateUpdateProductErrors }]
>

export type ListProducts = () => Promise<void>
export type GetProduct = (id: Product['id']) => Promise<void>

export type Context = {
    products: Product[] | null
    createProduct: CreateProduct
    updateProduct: UpdateProduct
    listProducts: ListProducts
    getProduct: GetProduct
    product: Product | null
    setProduct: (product: Product | null) => void
}
