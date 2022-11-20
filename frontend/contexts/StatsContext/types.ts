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

export type ProductPurchase = {
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
    dateRange: { startDate: number; endDate: number }
    setDateRange: React.Dispatch<
        React.SetStateAction<{ startDate: number; endDate: number }>
    >
    topProductSales: ProductSale[] | null
    topProductPurchases: ProductPurchase[] | null
    totalProductSales: number | null
    totalProductPurchases: number | null
    listTopProductSales: () => Promise<[true, ProductSale[]] | [false, string]>
    listTopProductPurchases: () => Promise<
        [true, ProductPurchase[]] | [false, string]
    >
    getTotalProductSales: () => Promise<[true, number] | [false, string]>
    getTotalProductPurchases: () => Promise<[true, number] | [false, string]>
}
