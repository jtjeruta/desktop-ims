import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
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
import { escapeRegExp } from '../../uitls'
import { formatDate } from '../../uitls/date-utils'

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
            <div className="flex justify-end mb-6 gap-3">
                <SearchBar
                    onSearch={(search) => setSearch(search)}
                    inputClass="!text-base h-full !bg-white"
                />
                <Button onClick={() => router.push('/purchase-orders/new')}>
                    Add Order
                </Button>
            </div>

            <Card bodyClsx="!px-0 !py-0 overflow-x-auto">
                <Table
                    page={page}
                    handlePageChange={(newPage) => setPage(newPage)}
                    rows={filteredOrders}
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
                            sort: (order) => order.orderDate,
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
