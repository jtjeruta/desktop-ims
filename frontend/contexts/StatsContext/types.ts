import { Product } from '../ProductContext/types'

export type ProductSale = {
    id: string
    product: Product
    variant: {
        name: string
        quantity: number
    }
    quantity: number
    total: number
}

export type Context = {
    topProductSales: ProductSale[] | null
    listTopProductSales: () => Promise<[true, ProductSale[]] | [false, string]>
}
