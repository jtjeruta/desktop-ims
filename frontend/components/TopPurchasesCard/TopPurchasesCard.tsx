import { useEffect } from 'react'
import { useAppContext } from '../../contexts/AppContext/AppContext'
import { useStatContext } from '../../contexts/StatsContext/StatsContext'
import { ProductPurchase } from '../../contexts/StatsContext/types'
import Card from '../Card/Card'
import Table from '../Table/Table'

const TopPurchasesCard = () => {
    const AppContext = useAppContext()
    const StatContext = useStatContext()

    useEffect(() => {
        if (StatContext.topProductPurchases === null) {
            StatContext.listTopProductPurchases()
        }
    }, [StatContext])

    return (
        <Card bodyClsx="!px-0 !py-0 overflow-x-auto">
            <Table
                rows={StatContext.topProductPurchases ?? []}
                loading={AppContext.isLoading('list-top-product-purchases')}
                columns={[
                    {
                        title: 'Top Purchases',
                        format: (row) => {
                            const product = row as ProductPurchase
                            return product.product.name
                        },
                    },
                    {
                        title: 'Unit',
                        format: (row) => {
                            const product = row as ProductPurchase
                            return product.variant.name
                        },
                    },
                    {
                        title: 'Qty',
                        format: (row) => {
                            const product = row as ProductPurchase
                            return product.quantity
                        },
                    },
                    {
                        title: 'Total',
                        format: (row) => {
                            const product = row as ProductPurchase
                            return product.total
                        },
                    },
                ]}
            />
        </Card>
    )
}

export default TopPurchasesCard
