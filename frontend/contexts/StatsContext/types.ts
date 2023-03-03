import { Product } from '../ProductContext/types'

export type ProductReport = {
    id: string
    product: Product
    stock: number
    totalPur: number
    purQty: number
    totalSales: number
    salesQty: number
    aveSales: number
    avePur: number
}

export type Context = {
    productReports: ProductReport[] | null
    dateRange: { startDate: number; endDate: number }
    setDateRange: React.Dispatch<
        React.SetStateAction<{ startDate: number; endDate: number }>
    >
    totalProductSales: number | null
    totalProductPurchases: number | null
    totalExpenses: number | null
    getTotalProductSales: () => Promise<[true, number] | [false, string]>
    getTotalProductPurchases: () => Promise<[true, number] | [false, string]>
    getTotalExpenses: () => Promise<[true, number] | [false, string]>
    listProductReports: () => Promise<[true, ProductReport[]] | [false, string]>
    search: string
    setSearch: React.Dispatch<React.SetStateAction<string>>
    totalReceivables: number | null
    getTotalReceivables: () => Promise<[true, number] | [false, string]>
}
