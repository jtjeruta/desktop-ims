import { useEffect } from 'react'
import { useAppContext } from '../../contexts/AppContext/AppContext'
import { useProductContext } from '../../contexts/ProductContext/ProductContext'
import { Product } from '../../contexts/ProductContext/types'
import { getProductWarehouseTotal } from '../../uitls/product-utils'
import Card from '../Card/Card'
import Table from '../Table/Table'

const TopPurchasesCard = () => {
    const AppContext = useAppContext()
    const ProductContext = useProductContext()

    useEffect(() => {
        if (ProductContext.products === null) {
            ProductContext.listProducts()
        }
    }, [ProductContext])

    return (
        <Card bodyClsx="!px-0 !py-0 overflow-x-auto">
            <Table
                rows={ProductContext.products ?? []}
                loading={AppContext.isLoading('list-products')}
                columns={[
                    {
                        title: 'Top Purchases',
                        format: (row) => {
                            const product = row as Product
                            return product.name
                        },
                    },
                    {
                        title: 'Stock',
                        format: (row) => {
                            const product = row as Product
                            return (
                                product.storeQty +
                                getProductWarehouseTotal(product)
                            )
                        },
                    },
                    {
                        title: 'Total',
                        format: (row) => {
                            const product = row as Product
                            return 100
                        },
                    },
                ]}
            />
        </Card>
    )
}

export default TopPurchasesCard
