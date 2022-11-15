import { useEffect } from 'react'
import { useAppContext } from '../../contexts/AppContext/AppContext'
import { useStatContext } from '../../contexts/StatsContext/StatsContext'
import { ProductSale } from '../../contexts/StatsContext/types'
import { formatCurrency } from '../../uitls'
import Card from '../Card/Card'
import Table from '../Table/Table'

const TopSalesCard = () => {
    const AppContext = useAppContext()
    const StatContext = useStatContext()

    useEffect(() => {
        if (StatContext.topProductSales === null) {
            StatContext.listTopProductSales()
        }
    }, [StatContext])

    return (
        <Card bodyClsx="!px-0 !py-0 overflow-x-auto">
            <Table
                rows={StatContext.topProductSales ?? []}
                loading={AppContext.isLoading('list-top-product-sales')}
                columns={[
                    {
                        title: 'Top Sales',
                        format: (row) => {
                            const sale = row as ProductSale
                            return sale.product.name
                        },
                    },
                    {
                        title: 'Unit',
                        format: (row) => {
                            const sale = row as ProductSale
                            return sale.variant.name
                        },
                    },
                    {
                        title: 'Qty',
                        format: (row) => {
                            const sale = row as ProductSale
                            return sale.quantity
                        },
                    },
                    {
                        title: 'Total',
                        format: (row) => {
                            const sale = row as ProductSale
                            return formatCurrency(sale.total)
                        },
                    },
                ]}
            />
        </Card>
    )
}

export default TopSalesCard
