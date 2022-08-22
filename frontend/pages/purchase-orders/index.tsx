import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Button from '../../components/Button/Button'
import Card from '../../components/Card/Card'
import PageHeader from '../../components/PageHeader/PageHeader'
import Table from '../../components/Table/Table'
import UserLayout from '../../components/UserLayout/UserLayout'
import { useAppContext } from '../../contexts/AppContext/AppContext'
import {
    PurchaseOrderContextProvider,
    usePurchaseOrderContext,
} from '../../contexts/PurchaseOrderContext/PurchaseOrderContext'
import { PurchaseOrder } from '../../contexts/PurchaseOrderContext/types'
import { formatCurrency } from '../../uitls'
import { formatDate } from '../../uitls/date-utils'

const PurchaseOrdersPageContent = () => {
    const AppContext = useAppContext()
    const PurOrdContext = usePurchaseOrderContext()
    const router = useRouter()
    const [search, setSearch] = useState<string>('')

    const filteredOrders = (PurOrdContext.orders || []).filter((order) => {
        const regex = new RegExp(search, 'igm')
        return [
            order.products.map((p) => p.product.name).join('-'),
            order.vendor.name,
            formatDate(order.createdAt),
        ].some((item) => regex.test(`${item}`))
    })

    useEffect(() => {
        async function init() {
            if (PurOrdContext.orders === null) {
                await PurOrdContext.listOrders()
            }
        }

        init()
    }, [PurOrdContext])

    return (
        <UserLayout>
            <PageHeader
                title="Purchase Orders"
                searchbar={{ onSearch: (search) => setSearch(search) }}
                buttons={[
                    {
                        text: 'Add Order',
                        onClick: () => router.push('/purchase-orders/new'),
                    },
                ]}
            />

            <Card bodyClsx="!px-0 !py-0">
                <Table
                    rows={filteredOrders}
                    loading={AppContext.isLoading('list-orders')}
                    columns={[
                        {
                            title: 'Created',
                            format: (row) => {
                                const order = row as PurchaseOrder
                                return formatDate(order.createdAt)
                            },
                            sort: (order) => order.createdAt,
                        },
                        {
                            title: 'Vendor',
                            format: (row) => {
                                const order = row as PurchaseOrder
                                return order.vendor.name
                            },
                            sort: (order) => order.vendor.name,
                        },
                        {
                            title: 'Products',
                            format: (row) => {
                                const order = row as PurchaseOrder
                                return (
                                    <div>
                                        {order.products.map((p) => (
                                            <div key={p.id}>
                                                {p.product.name}
                                            </div>
                                        ))}
                                    </div>
                                )
                            },
                        },
                        {
                            title: 'Total',
                            format: (row) => {
                                const order = row as PurchaseOrder
                                return formatCurrency(order.total)
                            },
                        },
                        {
                            title: ' ',
                            bodyClsx: 'w-0',
                            format: (row) => {
                                const order = row as PurchaseOrder
                                return (
                                    <Button
                                        style="link"
                                        onClick={() =>
                                            router.push(
                                                `/purchase-orders/${order.id}`
                                            )
                                        }
                                    >
                                        View
                                    </Button>
                                )
                            },
                        },
                    ]}
                />
            </Card>
        </UserLayout>
    )
}

const PurchaseOrdersPage = () => {
    return (
        <PurchaseOrderContextProvider>
            <PurchaseOrdersPageContent />
        </PurchaseOrderContextProvider>
    )
}

export default PurchaseOrdersPage
