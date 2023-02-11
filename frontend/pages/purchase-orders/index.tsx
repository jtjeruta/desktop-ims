import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { ActionButton } from '../../components/ActionButton/ActionButton'
import Button from '../../components/Button/Button'
import Card from '../../components/Card/Card'
import SearchBar from '../../components/SearchBar/SearchBar'
import Table from '../../components/Table/Table'
import UserLayout from '../../components/UserLayout/UserLayout'
import { useAppContext } from '../../contexts/AppContext/AppContext'
import {
    PurchaseOrderContextProvider,
    usePurchaseOrderContext,
} from '../../contexts/PurchaseOrderContext/PurchaseOrderContext'
import { PurchaseOrder } from '../../contexts/PurchaseOrderContext/types'
import { compare, escapeRegExp } from '../../utils'
import { formatDate } from '../../utils/date-utils'

const PurchaseOrdersPageContent = () => {
    const AppContext = useAppContext()
    const PurOrdContext = usePurchaseOrderContext()
    const router = useRouter()
    const [search, setSearch] = useState<string>('')
    const [page, setPage] = useState<number>(0)

    const filteredOrders = (PurOrdContext.orders || []).filter((order) => {
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

    useEffect(() => {
        async function init() {
            const response = await PurOrdContext.listOrders()
            if (!response[0]) return router.push('/500')
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
                    onClick={() => router.push('/purchase-orders/new')}
                    className="hidden md:block"
                >
                    Add Order
                </Button>
            </div>

            <Card bodyClsx="!px-0 !py-0 overflow-x-auto">
                <Table
                    page={page}
                    handlePageChange={(newPage) => setPage(newPage)}
                    rows={sortedOrders}
                    loading={AppContext.isLoading('list-purchase-orders')}
                    columns={[
                        {
                            title: 'Order Date',
                            format: (row) => {
                                const order = row as PurchaseOrder
                                return order.orderDate
                                    ? formatDate(order.orderDate)
                                    : ''
                            },
                            sort: (order) => order.orderDate ?? 0,
                        },
                        {
                            title: 'Invoice #',
                            format: (row) => {
                                const order = row as PurchaseOrder
                                return order.invoiceNumber ?? ''
                            },
                            sort: (order) => order.invoiceNumber ?? '',
                        },
                        {
                            title: 'Remarks',
                            format: (row) => {
                                const order = row as PurchaseOrder
                                return <div>{order.remarks}</div>
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
            <ActionButton onClick={() => router.push('/purchase-orders/new')} />
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
