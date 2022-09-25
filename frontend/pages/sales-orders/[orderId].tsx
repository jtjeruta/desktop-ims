import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import PageHeader from '../../components/PageHeader/PageHeader'
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

const SalesOrderPageContent = () => {
    const AppContext = useAppContext()
    const SalesOrderContext = useSalesOrderContext()
    const ProductContext = useProductContext()
    const CustomerContext = useCustomerContext()
    const router = useRouter()
    const [selectedProduct, setSelectedProduct] = useState<string | null>(null)
    const [customersError, setCustomersError] = useState<string>('')
    const isEditPage = ![undefined, 'new', ['']].includes(router.query.orderId)

    const submitButtonDisabled =
        AppContext.isLoading('get-sales-order') ||
        SalesOrderContext.draftOrder.products.length <= 0

    const submitButtonLoading =
        AppContext.isLoading('add-sales-order') ||
        AppContext.isLoading('update-sales-order') ||
        AppContext.isLoading('add-customer') ||
        AppContext.isLoading('update-customer')

    const onSubmit = async () => {
        if (!CustomerContext.draftCustomer) return
        const { id: customerId, ...customerData } =
            CustomerContext.draftCustomer
        const { id: orderId, ...orderData } = SalesOrderContext.draftOrder

        const customerRes = await (customerId
            ? CustomerContext.updateCustomer(customerId, customerData)
            : CustomerContext.createCustomer(CustomerContext.draftCustomer))

        if (!customerRes[0]) {
            setCustomersError(customerRes[1].message)
            return
        }

        const data: AddEditSalesOrderDoc = {
            products: orderData.products.map((product) => ({
                id: product.id,
                product: product.product.id,
                quantity: product.quantity,
                itemPrice: product.itemPrice,
                warehouse: product.warehouse?.id ?? null,
            })),
            customer: customerRes[1].id,
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

    useEffect(() => {
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

                if (response[0]) {
                    SalesOrderContext.setDraftOrder(response[1])
                    CustomerContext.setDraftCustomer(response[1].customer)
                }
            }

            // fetch products
            if (ProductContext.products === null) {
                await ProductContext.listProducts()
            }

            // fetch customers
            if (CustomerContext.customers === null) {
                await CustomerContext.listCustomers()
            }
        }

        init()
    }, [router, SalesOrderContext, ProductContext, CustomerContext, isEditPage])

    return (
        <>
            <UserLayout>
                <PageHeader
                    title={
                        SalesOrderContext.selectedOrder ? (
                            <code>#{SalesOrderContext.selectedOrder.id}</code>
                        ) : (
                            'New Order'
                        )
                    }
                />

                <div className="flex flex-col md:flex-row gap-3 mb-3">
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
                        disabled={submitButtonDisabled}
                        loading={submitButtonLoading}
                        onSubmit={onSubmit}
                        buttonText={
                            isEditPage ? 'Update Order' : 'Create Order'
                        }
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
                    />
                </div>
            </UserLayout>

            <AddOrderProductDialog type="sales" />
            <ConfirmDialog
                text={`Remove product?`}
                dialogKey="remove-order-product-dialog"
                onConfirm={() => {
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
        </>
    )
}

const SalesOrderPage = () => (
    <ProductContextProvider>
        <CustomerContextProvider>
            <SalesOrderContextProvider>
                <SalesOrderPageContent />
            </SalesOrderContextProvider>
        </CustomerContextProvider>
    </ProductContextProvider>
)

export default SalesOrderPage
