export type SalesReport = {
    productId: string
    productName: string
    qty: number
    variant: string
    price: number
    originalPrice: number
    avePrice: number
    sku: string
}

export type CostReport = {
    productId: string
    productName: string
    qty: number
    variant: string
    price: number
    originalPrice: number
    aveCost: number
    sku: string
}

export type Context = {
    costReports: CostReport[]
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
    listCostReports: () => Promise<[true, CostReport[]] | [false, string]>
    listSalesReports: () => Promise<[true, SalesReport[]] | [false, string]>
    salesReports: SalesReport[]
    search: string
    setSearch: React.Dispatch<React.SetStateAction<string>>
    totalReceivables: number | null
    getTotalReceivables: () => Promise<[true, number] | [false, string]>
}
