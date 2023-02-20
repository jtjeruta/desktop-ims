import { useRouter } from 'next/router'
import { useLayoutEffect, useState } from 'react'
import { ActionButton } from '../../components/ActionButton/ActionButton'
import Button from '../../components/Button/Button'
import Card from '../../components/Card/Card'
import SearchBar from '../../components/SearchBar/SearchBar'
import Table from '../../components/Table/Table'
import UserLayout from '../../components/UserLayout/UserLayout'
import { useAppContext } from '../../contexts/AppContext/AppContext'
import {
    SalesOrderContextProvider,
    useSalesOrderContext,
} from '../../contexts/SalesOrderContext/SalesOrderContext'
import { SalesOrder } from '../../contexts/SalesOrderContext/types'
import { compare, escapeRegExp } from '../../utils'
import { formatDate } from '../../utils/date-utils'

const SalesOrdersPageContent = () => {
    const AppContext = useAppContext()
    const SalesOrderContext = useSalesOrderContext()
    const router = useRouter()
    const [search, setSearch] = useState<string>('')
    const [page, setPage] = useState<number>(0)

    const filteredOrders = (SalesOrderContext.orders || []).filter((order) => {
        const regex = new RegExp(escapeRegExp(search), 'igm')
        return [
            formatDate(order.createdAt),
            order.invoiceNumber,
            order.remarks,
        ].some((item) => regex.test(`${item}`))
    })

    const sortedOrders = filteredOrders.sort(
        (a, b) => -compare(a.orderDate ?? 0, b.orderDate ?? 0)
    )

    useLayoutEffect(() => {
        async function init() {
            const response = await SalesOrderContext.listOrders()

            if (!response[0]) {
                return router.push('/500')
            }
        }

        init()
    }, [])

    return (
        <UserLayout>
            <div className="flex justify-end mb-4 gap-3">
                <SearchBar
                    onSearch={(search) => {
                        setSearch(search)
                        setPage(0)
                    }}
                    inputClass="!text-base h-full !bg-white"
                />
                <Button
                    className="hidden md:block"
                    onClick={() => router.push('/sales-orders/new')}
                >
                    Add Order
                </Button>
            </div>

            <Card bodyClsx="!px-0 !py-0 overflow-x-auto">
                <Table
                    page={page}
                    handlePageChange={(newPage) => setPage(newPage)}
                    rows={sortedOrders}
                    loading={AppContext.isLoading('list-sales-orders')}
                    columns={[
                        {
                            title: 'Order Date',
                            format: (row) => {
                                const order = row as SalesOrder
                                return order.orderDate
                                    ? formatDate(order.orderDate)
                                    : ''
                            },
                            sort: (order) => order.orderDate ?? 0,
                        },
                        {
                            title: 'Invoice #',
                            format: (row) => {
                                const order = row as SalesOrder
                                return order.invoiceNumber ?? ''
                            },
                            sort: (order) => order.invoiceNumber ?? '',
                        },
                        {
                            title: 'Customer',
                            format: (row) => {
                                const order = row as SalesOrder
                                return order.customer?.name ?? ''
                            },
                            sort: (order) => order.customer?.name ?? '',
                        },
                        {
                            title: 'Remarks',
                            format: (row) => {
                                const order = row as SalesOrder
                                return <div>{order.remarks}</div>
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
            <ActionButton onClick={() => router.push('/sales-orders/new')} />
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
