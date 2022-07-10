import React, { useMemo, useState } from 'react'
import * as ProductsAPI from '../../apis/ProductAPI'
import * as VariantsAPI from '../../apis/VariantAPI'
import { useAppContext } from '../AppContext/AppContext'
import * as Types from './types'

const ProductContext = React.createContext<Types.Context | any>({})

const ProductContextProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const AppContext = useAppContext()
    const [products, setProducts] = useState<Types.Product[] | null>(null)
    const [product, setProduct] = useState<Types.Product | null>(null)
    const [variantToDelete, setVariantToDelete] =
        useState<Types.Variant | null>(null)

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

    const createVariant: Types.CreateVariant = async (
        productId,
        variantDoc
    ) => {
        const key = 'add-variant'

        AppContext.addLoading(key)
        const response = await VariantsAPI.createVariant(productId, variantDoc)
        AppContext.removeLoading(key)

        if (!response[0]) {
            return [false, response[1].data]
        }

        // update products
        setProducts((prev) =>
            (prev || []).map((product) => {
                if (product.id !== productId) return product
                const variants = [...product.variants, response[1]]
                return { ...product, variants }
            })
        )

        // update current product detials
        if (productId === product?.id) {
            const variants = [...product.variants, response[1]]
            setProduct({ ...product, variants })
        }

        return [true, response[1]]
    }

    const deleteVariant: Types.DeleteVariant = async (variantId) => {
        const key = 'delete-variant'

        AppContext.addLoading(key)
        const response = await VariantsAPI.deleteVariant(variantId)
        AppContext.removeLoading(key)

        if (!response[0]) {
            return [false, response[1]]
        }

        // update products
        setProducts((prev) =>
            (prev || []).map((product) => {
                const variants = product.variants.filter(
                    (variant) => variant.id !== variantId
                )
                return { ...product, variants }
            })
        )

        // update current product detials
        if (product) {
            const variants = product.variants.filter(
                (variant) => variant.id !== variantId
            )
            setProduct({ ...product, variants })
        }

        return [true]
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
            createVariant,
            deleteVariant,
            variantToDelete,
            setVariantToDelete,
        }),
        [products, product, variantToDelete]
    )

    return (
        <ProductContext.Provider value={value}>
            {children}
        </ProductContext.Provider>
    )
}

const useProductContext = () => React.useContext<Types.Context>(ProductContext)

export { ProductContext, ProductContextProvider, useProductContext }
