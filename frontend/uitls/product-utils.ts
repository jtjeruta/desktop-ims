import { Product } from '../contexts/ProductContext/types'

// TODO: add tests
export const getProductMarkup = (product: Product | null) =>
    product && product.aveUnitCost
        ? ((product.price - product.aveUnitCost) / product.aveUnitCost) * 100
        : null
