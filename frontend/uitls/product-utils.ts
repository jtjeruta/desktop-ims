import {
    Context as ProductContextType,
    Product,
} from '../contexts/ProductContext/types'
import { Context as SalesOrderContextType } from '../contexts/SalesOrderContext/types'

// TODO: add tests
export const getProductMarkup = (product: Product | null) =>
    product && product.aveUnitCost
        ? ((product.price - product.aveUnitCost) / product.aveUnitCost) * 100
        : null

export const getProductWarehouseTotal = (product: Product | null) =>
    product
        ? product.warehouses.reduce(
              (acc, warehouse) => warehouse.quantity + acc,
              0
          )
        : 0

export const customerCanBuyProduct = (
    contextProducts: Product[],
    productId: string,
    variantId: string,
    warehouseId: string,
    amountOfUnits: number
) => {
    const product = contextProducts?.find((p) => p.id === productId)
    const variant = product?.variants.find((v) => v.id === variantId)
    const warehouse = product?.warehouses.find((w) => w.id === warehouseId)
    const quantity = (amountOfUnits ?? 1) * (variant?.quantity ?? 1)
    const stock = warehouse?.quantity ?? product?.storeQty ?? 0
    return { valid: stock >= quantity, remainingQuantity: stock - quantity }
}

export const updateProductOrWarehouseQuantity = (
    ProductContext: ProductContextType,
    productId: string,
    warehouseId: string | null | undefined,
    newQuantity: number
) => {
    ProductContext.setProducts(
        (prev) =>
            prev?.map((p) => {
                if (p.id === productId) {
                    if (warehouseId) {
                        const warehouses = p.warehouses.map((w) => {
                            if (w.id === warehouseId) {
                                return {
                                    ...w,
                                    quantity: newQuantity,
                                }
                            }
                            return w
                        })

                        return { ...p, warehouses }
                    }

                    return { ...p, storeQty: newQuantity }
                }

                return p
            }) ?? null
    )
}

export const undoProductOrWarehouseStockChanges = (
    ProductContext: ProductContextType,
    SalesOrderContext: SalesOrderContextType,
    productId: string | null
) => {
    const orderProduct = SalesOrderContext.draftOrder.products.find(
        (p) => p.id === productId
    )

    const quantityToAdd =
        (orderProduct?.quantity ?? 0) * (orderProduct?.variant?.quantity ?? 1)

    ProductContext.setProducts(
        (prev) =>
            prev?.map((product) => {
                if (product.id === orderProduct?.product.id) {
                    if (orderProduct?.warehouse) {
                        const warehouses = product?.warehouses.map(
                            (warehouse) => {
                                if (
                                    warehouse.id === orderProduct?.warehouse?.id
                                ) {
                                    return {
                                        ...warehouse,
                                        quantity:
                                            warehouse.quantity + quantityToAdd,
                                    }
                                }

                                return warehouse
                            }
                        )

                        return { ...product, warehouses }
                    }

                    return {
                        ...product,
                        storeQty: product.storeQty + quantityToAdd,
                    }
                }

                return product
            }) ?? null
    )
}
