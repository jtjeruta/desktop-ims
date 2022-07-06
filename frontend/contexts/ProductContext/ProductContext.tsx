import React, { useMemo, useState } from 'react'
import * as ProductsAPI from '../../apis/ProductAPI'
import { useAppContext } from '../AppContext/AppContext'
import * as Types from './types'

const ProductContext = React.createContext<Types.Context | any>({})

const ProductContextProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const AppContext = useAppContext()
    const [products, setProducts] = useState<Types.Product[] | null>(null)
    const [product, setProduct] = useState<Types.Product | null>(null)

    const createProduct: Types.CreateProduct = async (productDoc) => {
        const key = 'add-product'

        AppContext.addLoading(key)
        const response = await ProductsAPI.createProduct(productDoc)
        AppContext.removeLoading(key)

        if (!response[0]) {
            return [false, response[1].data]
        }

        setProducts((prev) => [...(prev || []), response[1]])
        return [true, response[1]]
    }

    const updateProduct: Types.UpdateProduct = async (id, productDoc) => {
        const key = 'update-product'

        AppContext.addLoading(key)
        const response = await ProductsAPI.updateProduct(id, productDoc)
        AppContext.removeLoading(key)

        if (!response[0]) {
            return [false, response[1].data]
        }

        // update products
        setProducts((prev) =>
            (prev || []).map((product) => {
                if (product.id !== id) return product
                return response[1]
            })
        )

        // update current product detials
        if (id === product?.id) {
            setProduct(response[1])
        }

        return [true, response[1]]
    }

    const listProducts: Types.ListProducts = async () => {
        const key = 'list-products'

        AppContext.addLoading(key)
        const response = await ProductsAPI.listProducts()
        AppContext.removeLoading(key)

        if (!response[0]) {
            AppContext.addNotification({
                title: 'Something went wrong.',
                type: 'danger',
                body: 'Please try again later',
            })
            return
        }

        setProducts(response[1])
    }

    const getProduct: Types.GetProduct = async (id) => {
        const key = 'get-product'

        AppContext.addLoading(key)
        const response = await ProductsAPI.getProduct(id)
        AppContext.removeLoading(key)

        if (!response[0]) {
            AppContext.addNotification({
                title: 'Something went wrong.',
                type: 'danger',
                body: 'Please try again later',
            })
            return response
        }

        setProduct(response[1])
        return response
    }

    const value: Types.Context = useMemo(
        () => ({
            products,
            createProduct,
            updateProduct,
            listProducts,
            getProduct,
            product,
            setProduct,
        }),
        [products, product]
    )

    return (
        <ProductContext.Provider value={value}>
            {children}
        </ProductContext.Provider>
    )
}

const useProductContext = () => React.useContext<Types.Context>(ProductContext)

export { ProductContext, ProductContextProvider, useProductContext }
