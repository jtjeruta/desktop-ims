import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Button from '../../components/Button/Button'
import Card from '../../components/Card/Card'
import PageHeader from '../../components/PageHeader/PageHeader'
import Table from '../../components/Table/Table'
import UserLayout from '../../components/UserLayout/UserLayout'
import { useAppContext } from '../../contexts/AppContext/AppContext'
import {
    SalesOrderContextProvider,
    useSalesOrderContext,
} from '../../contexts/SalesOrderContext/SalesOrderContext'
import { SalesOrder } from '../../contexts/SalesOrderContext/types'
import { formatCurrency } from '../../uitls'
import { formatDate } from '../../uitls/date-utils'

const SalesOrdersPageContent = () => {
    const AppContext = useAppContext()
    const SalesOrderContext = useSalesOrderContext()
    const router = useRouter()
    const [search, setSearch] = useState<string>('')

    const filteredOrders = (SalesOrderContext.orders || []).filter((order) => {
        const regex = new RegExp(search, 'igm')
        return [
            order.products.map((p) => p.product.name).join('-'),
            order.customer.name,
            order.total,
            formatDate(order.createdAt),
        ].some((item) => regex.test(`${item}`))
    })

    useEffect(() => {
        async function init() {
            if (SalesOrderContext.orders === null) {
                await SalesOrderContext.listOrders()
            }
        }

        init()
    }, [SalesOrderContext])

    return (
        <UserLayout>
            <PageHeader
                title="Sales Orders"
                searchbar={{ onSearch: (search) => setSearch(search) }}
                buttons={[
                    {
                        text: 'Add Order',
                        onClick: () => router.push('/sales-orders/new'),
                    },
                ]}
            />

            <Card bodyClsx="!px-0 !py-0 overflow-x-auto">
                <Table
                    rows={filteredOrders}
                    loading={AppContext.isLoading('list-sales-orders')}
                    columns={[
                        {
                            title: 'Created',
                            format: (row) => {
                                const order = row as SalesOrder
                                return formatDate(order.createdAt)
                            },
                            sort: (order) => order.createdAt,
                        },
                        {
                            title: 'Vendor',
                            format: (row) => {
                                const order = row as SalesOrder
                                return order.customer.name
                            },
                            sort: (order) => order.customer.name,
                        },
                        {
                            title: 'Products',
                            format: (row) => {
                                const order = row as SalesOrder
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
                                const order = row as SalesOrder
                                return formatCurrency(order.total)
                            },
                        },
                        {
                            title: ' ',
                            bodyClsx: 'w-0',
                            format: (row) => {
                                const order = row as SalesOrder
                                return (
                                    <Button
                                        style="link"
                                        onClick={() =>
                                            router.push(
                                                `/sales-orders/${order.id}`
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

const SalesOrdersPage = () => {
    return (
        <SalesOrderContextProvider>
            <SalesOrdersPageContent />
        </SalesOrderContextProvider>
    )
}

export default SalesOrdersPage
