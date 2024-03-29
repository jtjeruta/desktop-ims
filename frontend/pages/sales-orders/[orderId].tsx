import { useLayoutEffect, useState } from 'react'
import { useRouter } from 'next/router'
import UserLayout from '../../components/UserLayout/UserLayout'
import {
    SalesOrderContextProvider,
    useSalesOrderContext,
} from '../../contexts/SalesOrderContext/SalesOrderContext'
import Card from '../../components/Card/Card'
import {
    ProductContextProvider,
    useProductContext,
} from '../../contexts/ProductContext/ProductContext'
import AddOrderProductDialog from '../../components/AddOrderProductDialog/AddOrderProductDialog'
import { useAppContext } from '../../contexts/AppContext/AppContext'
import OrderProductsTable from '../../components/OrderProductsTable/OrderProductsTable'
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog'
import { AddEditSalesOrderDoc } from '../../contexts/SalesOrderContext/types'
import {
    useCustomerContext,
    CustomerContextProvider,
} from '../../contexts/CustomerContext/CustomerContext'
import OrderRemarksForm from '../../components/OrderRemarksForm/OrderRemarksForm'
import SalesOrderCustomerForm from '../../components/SalesOrderCustomerForm/SalesOrderCustomerForm'
import OrderSummary from '../../components/OrderSummary/OrderSummary'
import { undoProductOrWarehouseStockChanges } from '../../utils/product-utils'
import {
    useWarehouseContext,
    WarehouseContextProvider,
} from '../../contexts/WarehouseContext/WarehouseContext'
import Alert from '../../components/Alert/Alert'

const SalesOrderPageContent = () => {
    const AppContext = useAppContext()
    const SalesOrderContext = useSalesOrderContext()
    const ProductContext = useProductContext()
    const CustomerContext = useCustomerContext()
    const WarehouseContext = useWarehouseContext()
    const router = useRouter()
    const [selectedProduct, setSelectedProduct] = useState<string | null>(null)
    const [customersError, setCustomersError] = useState<string>('')
    const [hasAvailableProducts, setHasAvailableProducts] =
        useState<boolean>(true)
    const isEditPage = ![undefined, 'new', ['']].includes(router.query.orderId)

    const submitButtonDisabled =
        AppContext.isLoading('get-sales-order') ||
        AppContext.isLoading('list-products') ||
        AppContext.isLoading('list-customers') ||
        AppContext.isLoading('list-warehouses') ||
        SalesOrderContext.draftOrder.products.length <= 0 ||
        CustomerContext.customers === null ||
        WarehouseContext.warehouses === null

    const submitButtonLoading =
        AppContext.isLoading('add-sales-order') ||
        AppContext.isLoading('update-sales-order') ||
        AppContext.isLoading('add-customer') ||
        AppContext.isLoading('update-customer')

    const onSubmit = async () => {
        let customer = null
        const { id: orderId, ...orderData } = SalesOrderContext.draftOrder

        if (CustomerContext.draftCustomer.name !== '') {
            const { id: customerId, ...customerData } =
                CustomerContext.draftCustomer

            const customerRes = await (customerId
                ? CustomerContext.updateCustomer(customerId, customerData)
                : CustomerContext.createCustomer(CustomerContext.draftCustomer))

            if (!customerRes[0]) {
                setCustomersError(customerRes[1].message)
                return
            }

            customer = customerRes[1]
        }

        const data: AddEditSalesOrderDoc = {
            products: orderData.products.map((product) => ({
                id: product.id,
                product: product.product.id,
                quantity: product.quantity,
                itemPrice: product.itemPrice,
                warehouse: product.warehouse?.id ?? null,
                variant: product.variant,
            })),
            customer: customer?.id ?? null,
            remarks: orderData.remarks ?? '',
            orderDate: orderData.orderDate,
            invoiceNumber: orderData.invoiceNumber,
        }

        const purOrdRes = await (orderId
            ? SalesOrderContext.updateOrder(orderId, data)
            : SalesOrderContext.createOrder(data))

        if (!purOrdRes[0]) return
        if (!orderId) router.push(`/sales-orders/${purOrdRes[1].id}`)
    }

    useLayoutEffect(() => {
        async function init() {
            if (
                isEditPage &&
                router.query &&
                SalesOrderContext.selectedOrder === null
            ) {
                const response = await SalesOrderContext.getOrder(
                    router.query.orderId as string
                )

                if (!response[0] && response[1].status === 404) {
                    return router.replace('/404')
                }

                if (!response[0]) {
                    return router.push('/500')
                }

                if (response[0]) {
                    SalesOrderContext.setDraftOrder((prev) => ({
                        ...prev,
                        ...response[1],
                    }))
                    response[1].customer &&
                        CustomerContext.setDraftCustomer(response[1].customer)
                }
            }

            const responses = await Promise.all([
                ProductContext.listProducts(),
                CustomerContext.listCustomers(),
                WarehouseContext.listWarehouses(),
            ])

            if (responses.some((response) => !response[0])) {
                return router.push('/500')
            }

            if (responses[0][0]) {
                setHasAvailableProducts(
                    responses[0][1].some((product) => product.published)
                )
            }
        }

        init()
    }, [router, isEditPage])

    return (
        <>
            <UserLayout backButton>
                {!hasAvailableProducts && (
                    <Alert
                        type="warning"
                        title="No products added yet"
                        content="You need to add products before you can create a sales order."
                        className="mb-3"
                    />
                )}

                <div className="mb-4">
                    <h1>
                        {AppContext.isLoading('get-order') ? (
                            <span className="w-full h-12" />
                        ) : SalesOrderContext.selectedOrder ? (
                            `#${SalesOrderContext.selectedOrder.id}`
                        ) : (
                            'New Order'
                        )}
                    </h1>
                </div>

                <div className="flex flex-col-reverse md:flex-row gap-3 mb-3">
                    <div className="w-full md:max-w-sm">
                        <Card title="Customer Details">
                            <SalesOrderCustomerForm
                                error={customersError}
                                clearError={() => setCustomersError('')}
                            />
                        </Card>
                    </div>
                    <OrderProductsTable
                        products={SalesOrderContext.draftOrder.products}
                        onAdd={() => {
                            AppContext.openDialog('add-order-product-dialog')
                        }}
                        onDelete={(id) => () => {
                            setSelectedProduct(id)
                            AppContext.openDialog('remove-order-product-dialog')
                        }}
                    />
                </div>
                <div className="flex flex-col md:flex-row gap-3">
                    <OrderRemarksForm
                        remarks={SalesOrderContext.draftOrder.remarks}
                        onChange={(remarks: string) => {
                            SalesOrderContext.setDraftOrder((prev) => ({
                                ...prev,
                                remarks: remarks,
                            }))
                        }}
                    />
                    <OrderSummary
                        total={SalesOrderContext.draftOrder?.total}
                        loading={submitButtonLoading}
                        onSubmit={onSubmit}
                        onChange={(
                            orderDate: number,
                            invoiceNumber: string
                        ) => {
                            SalesOrderContext.setDraftOrder((prev) => ({
                                ...prev,
                                orderDate,
                                invoiceNumber,
                            }))
                        }}
                        orderDate={SalesOrderContext.draftOrder.orderDate}
                        invoiceNumber={
                            SalesOrderContext.draftOrder.invoiceNumber
                        }
                        showDeleteButton={!!SalesOrderContext.selectedOrder}
                        onDelete={() =>
                            AppContext.openDialog('remove-order-dialog')
                        }
                        disabled={submitButtonDisabled}
                    />
                </div>
            </UserLayout>

            <AddOrderProductDialog type="sales" />
            <ConfirmDialog
                text={`Remove product?`}
                dialogKey="remove-order-product-dialog"
                onConfirm={() => {
                    undoProductOrWarehouseStockChanges(
                        ProductContext,
                        SalesOrderContext,
                        WarehouseContext,
                        selectedProduct
                    )

                    SalesOrderContext.setDraftOrder((prev) => {
                        const products = prev.products.filter(
                            (p) => p.id !== selectedProduct
                        )

                        return {
                            ...prev,
                            products,
                            total: products.reduce(
                                (acc, p) => acc + p.totalPrice,
                                0
                            ),
                        }
                    })

                    AppContext.closeDialog()
                }}
            />

            <ConfirmDialog
                text={`Are you sure you want to delete this order?`}
                dialogKey="remove-order-dialog"
                onConfirm={async () => {
                    if (!SalesOrderContext.selectedOrder) return

                    const response = await SalesOrderContext.deleteOrder(
                        SalesOrderContext.selectedOrder.id
                    )

                    AppContext.closeDialog()

                    if (!response[0]) {
                        return AppContext.addNotification({
                            title: 'Something went wrong!',
                            type: 'danger',
                        })
                    }

                    AppContext.addNotification({
                        title: 'Order deleted',
                        type: 'success',
                    })

                    router.push('/sales-orders')
                }}
            />
        </>
    )
}

const SalesOrderPage = () => (
    <ProductContextProvider>
        <WarehouseContextProvider>
            <CustomerContextProvider>
                <SalesOrderContextProvider>
                    <SalesOrderPageContent />
                </SalesOrderContextProvider>
            </CustomerContextProvider>
        </WarehouseContextProvider>
    </ProductContextProvider>
)

export default SalesOrderPage
