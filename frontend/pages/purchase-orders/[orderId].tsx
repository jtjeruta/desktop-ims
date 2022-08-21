import { useEffect } from 'react'
import PageHeader from '../../components/PageHeader/PageHeader'
import UserLayout from '../../components/UserLayout/UserLayout'
import {
    PurchaseOrderContextProvider,
    usePurchaseOrderContext,
} from '../../contexts/PurchaseOrderContext/PurchaseOrderContext'
import { useRouter } from 'next/router'
import Card from '../../components/Card/Card'
import Table from '../../components/Table/Table'
import Button from '../../components/Button/Button'
import { FaTrash } from 'react-icons/fa'
import AddEditVendorForm from '../../components/AddEditVendorForm/AddEditVendorForm'

const PurchaseOrderPageContent = () => {
    const PurOrdContext = usePurchaseOrderContext()
    const router = useRouter()

    useEffect(() => {
        async function init() {
            if (
                router.query.orderId &&
                router.query.orderId !== 'new' &&
                PurOrdContext.selectedOrder === null
            ) {
                const response = await PurOrdContext.getOrder(
                    router.query.orderId as string
                )

                if (!response[0] && response[1].status === 404) {
                    router.replace('/404')
                }
            }
        }

        init()
    }, [router, PurOrdContext])

    return (
        <UserLayout>
            <PageHeader
                title={
                    PurOrdContext.selectedOrder ? (
                        <code>#{PurOrdContext.selectedOrder.id}</code>
                    ) : (
                        'New Order'
                    )
                }
            />

            <div className="flex flex-row gap-3">
                <Card title="Vendor Details">
                    <AddEditVendorForm />
                </Card>
                <Card cardClsx="grow" bodyClsx="!px-0 !py-0 h-full">
                    <div className="flex flex-col h-full">
                        <div className="grow">
                            <Table
                                rows={
                                    PurOrdContext.selectedOrder?.products || []
                                }
                                columns={[
                                    {
                                        title: 'Product',
                                        format: (row) => row.product.name,
                                    },
                                    {
                                        title: 'SKU',
                                        format: (row) => row.product.sku,
                                    },
                                    {
                                        title: 'QTY',
                                        format: (row) => row.quantity,
                                    },
                                    {
                                        title: 'Unit Price',
                                        format: (row) => row.itemPrice,
                                    },
                                    {
                                        title: 'Sub-Total',
                                        format: (row) => row.itemTotal,
                                    },
                                    {
                                        title: 'Actions',
                                        format: (row) => {
                                            return (
                                                <Button>
                                                    <FaTrash />
                                                </Button>
                                            )
                                        },
                                        headerClsx: 'text-right',
                                        bodyClsx: 'flex justify-end',
                                    },
                                ]}
                            />
                        </div>

                        <div className="flex justify-end py-3 px-4">
                            <Button>Add</Button>
                        </div>
                    </div>
                </Card>
            </div>
        </UserLayout>
    )
}

const PurchaseOrderPage = () => (
    <PurchaseOrderContextProvider>
        <PurchaseOrderPageContent />
    </PurchaseOrderContextProvider>
)

export default PurchaseOrderPage
