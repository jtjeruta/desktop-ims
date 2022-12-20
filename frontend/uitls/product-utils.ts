import {
    Context as ProductContextType,
    Product,
} from '../contexts/ProductContext/types'
import { Context as SalesOrderContextType } from '../contexts/SalesOrderContext/types'
import {
    Context as WarehouseContextType,
    Warehouse,
} from '../contexts/WarehouseContext/types'

// TODO: add tests
export const getProductMarkup = (product: Product | null) =>
    product && product.aveUnitCost
        ? ((product.price - product.aveUnitCost) / product.aveUnitCost) * 100
        : null

export const getProductWarehouseTotal = (
    warehouses: Warehouse[] | null,
    product: Product | null
) => {
    return (
        warehouses?.reduce((acc, warehouse) => {
            warehouse.products.forEach((whp) => {
                if (whp.source.id !== product?.id) return
                acc += whp.stock
            })
            return acc
        }, 0) ?? 0
    )
}

export const customerCanBuyProduct = (
    contextProducts: Product[],
    contextWarehouses: Warehouse[],
    productId: string,
    variantId: string,
    warehouseId: string,
    amountOfUnits: number
) => {
    const product = contextProducts?.find((p) => p.id === productId)
    const variant = product?.variants.find((v) => v.id === variantId)
    const warehouse = contextWarehouses
        .find((w) => w.id === warehouseId)
        ?.products.find((whp) => whp.source.id === warehouseId)
    const quantity = (amountOfUnits ?? 1) * (variant?.quantity ?? 1)
    const stock = warehouse?.stock ?? product?.stock ?? 0
    return { valid: stock >= quantity, remainingQuantity: stock - quantity }
}

export const updateProductOrWarehouseQuantity = (
    WarehouseContext: WarehouseContextType,
    productId: string,
    warehouseId: string | null | undefined,
    newStock: number
) => {
    WarehouseContext.setWarehouses(
        (prev) =>
            prev?.map((warehouse) => {
                if (warehouseId !== warehouse.id) return warehouse
                const products = warehouse.products.map((whp) => {
                    if (productId !== whp.source.id) return whp
                    return { ...whp, stock: newStock }
                })
                return { ...warehouse, products }
            }) || null
    )
}

export const undoProductOrWarehouseStockChanges = (
    ProductContext: ProductContextType,
    SalesOrderContext: SalesOrderContextType,
    WarehouseContext: WarehouseContextType,
    productId: string | null
) => {
    const orderProduct = SalesOrderContext.draftOrder.products.find(
        (p) => p.id === productId
    )

    const stockToAdd =
        (orderProduct?.quantity ?? 0) * (orderProduct?.variant?.quantity ?? 1)

    WarehouseContext.setWarehouses(
        (prev) =>
            prev?.map((warehouse) => {
                if (orderProduct?.warehouse?.id !== warehouse.id) {
                    return warehouse
                }

                const products = warehouse.products.map((whp) => {
                    if (productId !== whp.source.id) return whp
                    return { ...whp, stock: whp.stock + stockToAdd }
                })
                return { ...warehouse, products }
            }) || null
    )

    ProductContext.setProducts(
        (prev) =>
            prev?.map((product) => {
                if (product.id !== orderProduct?.product.id) {
                    return product
                }
                return {
                    ...product,
                    stock: product.stock + stockToAdd,
                }
            }) ?? null
    )
}

export type ProductWarehouse = {
    id: string
    name: string
    stock: number
}

export const getProductWarehouses = (
    warehouses: Warehouse[] | null,
    product: Product | null
) => {
    const productWarehouses =
        warehouses?.reduce((acc: ProductWarehouse[], warehouse) => {
            const warehouseProduct = warehouse.products.find(
                (whp) => whp.source.id === product?.id
            )
            if (!warehouseProduct || warehouseProduct.stock <= 0) return acc
            return [
                ...acc,
                {
                    id: warehouse.id,
                    name: warehouse.name,
                    stock: warehouseProduct.stock,
                },
            ]
        }, []) ?? []

    return productWarehouses
}
