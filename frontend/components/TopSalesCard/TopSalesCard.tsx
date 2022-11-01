import { useEffect } from 'react'
import { useAppContext } from '../../contexts/AppContext/AppContext'
import { useProductContext } from '../../contexts/ProductContext/ProductContext'
import { Product } from '../../contexts/ProductContext/types'
import { formatCurrency } from '../../uitls'
import Card from '../Card/Card'
import Table from '../Table/Table'

const TopSalesCard = () => {
    const AppContext = useAppContext()
    const ProductContext = useProductContext()

    useEffect(() => {
        ProductContext.listProducts()
    }, [])

    return (
        <Card bodyClsx="!px-0 !py-0 overflow-x-auto">
            <Table
                rows={ProductContext.products ?? []}
                loading={AppContext.isLoading('list-products')}
                columns={[
                    {
                        title: 'Top Sales',
                        format: (row) => {
                            const product = row as Product
                            return product.name
                        },
                    },
                    {
                        title: 'Unit',
                        format: (row) => {
                            const product = row as Product
                            return product.variants?.[0].name
                        },
                    },
                    {
                        title: 'Total',
                        format: (row) => {
                            return formatCurrency(100000)
                        },
                    },
                ]}
            />
        </Card>
    )
}

export default TopSalesCard
