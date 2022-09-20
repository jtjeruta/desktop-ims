import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import PageHeader from '../../components/PageHeader/PageHeader'
import UserLayout from '../../components/UserLayout/UserLayout'
import {
    PurchaseOrderContextProvider,
    usePurchaseOrderContext,
} from '../../contexts/PurchaseOrderContext/PurchaseOrderContext'
import Card from '../../components/Card/Card'
import {
    ProductContextProvider,
    useProductContext,
} from '../../contexts/ProductContext/ProductContext'
import AddOrderProductDialog from '../../components/AddOrderProductDialog/AddOrderProductDialog'
import { useAppContext } from '../../contexts/AppContext/AppContext'
import OrderProductsTable from '../../components/OrderProductsTable/OrderProductsTable'
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog'
import { formatCurrency } from '../../uitls'
import Button from '../../components/Button/Button'
import { AddEditPurchaseOrderDoc } from '../../contexts/PurchaseOrderContext/types'
import {
    useVendorContext,
    VendorContextProvider,
} from '../../contexts/VendorContext/VendorContext'
import OrderRemarksForm from '../../components/OrderRemarksForm/OrderRemarksForm'
import AddEditVendorFormForPurchaseOrder from '../../components/AddEditVendorFormForPurchaseOrder/AddEditVendorFormForPurchaseOrder'

const PurchaseOrderPageContent = () => {
    const AppContext = useAppContext()
    const PurOrdContext = usePurchaseOrderContext()
    const ProductContext = useProductContext()
    const VendorContext = useVendorContext()
    const router = useRouter()
    const [selectedProduct, setSelectedProduct] = useState<string | null>(null)
    const [vendorsError, setVendorsError] = useState<string>('')
    const isEditPage = ![undefined, 'new', ['']].includes(router.query.orderId)

    const disableSubmitButton =
        AppContext.isLoading('get-purchase-order') &&
        PurOrdContext.draftOrder.products.length <= 0

    const onSubmit = async () => {
        if (!VendorContext.draftVendor) return
        const { id: vendorId, ...vendorData } = VendorContext.draftVendor
        const { id: orderId, ...orderData } = PurOrdContext.draftOrder

        const vendorRes = await (vendorId
            ? VendorContext.updateVendor(vendorId, vendorData)
            : VendorContext.createVendor(VendorContext.draftVendor))

        if (!vendorRes[0]) {
            setVendorsError(vendorRes[1].message)
            return
        }

        const data: AddEditPurchaseOrderDoc = {
            products: orderData.products.map((product) => ({
                id: product.id,
                product: product.product.id,
                quantity: product.quantity,
                itemPrice: product.itemPrice,
                warehouse: product.warehouse?.id ?? null,
            })),
            vendor: vendorRes[1].id,
            remarks: orderData.remarks ?? '',
        }

        const purOrdRes = await (orderId
            ? PurOrdContext.updateOrder(orderId, data)
            : PurOrdContext.createOrder(data))

        if (!purOrdRes[0]) return
        if (!orderId) router.push(`/purchase-orders/${purOrdRes[1].id}`)
    }

    useEffect(() => {
        async function init() {
            if (
                isEditPage &&
                router.query &&
                PurOrdContext.selectedOrder === null
            ) {
                const response = await PurOrdContext.getOrder(
                    router.query.orderId as string
                )

                if (!response[0] && response[1].status === 404) {
                    return router.replace('/404')
                }

                if (response[0]) {
                    PurOrdContext.setDraftOrder(response[1])
                    VendorContext.setDraftVendor(response[1].vendor)
                }
            }

            // fetch products
            if (ProductContext.products === null) {
                await ProductContext.listProducts()
            }

            // fetch vendors
            if (VendorContext.vendors === null) {
                await VendorContext.listVendors()
            }
        }

        init()
    }, [router, PurOrdContext, ProductContext, VendorContext, isEditPage])

    return (
        <>
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

                <div className="flex flex-col md:flex-row gap-3 mb-3">
                    <div className="w-full md:max-w-sm">
                        <Card title="Vendor Details">
                            <AddEditVendorFormForPurchaseOrder
                                error={vendorsError}
                                clearError={() => setVendorsError('')}
                            />
                        </Card>
                    </div>
                    <OrderProductsTable
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
                    <OrderRemarksForm />
                    <Card cardClsx="w-full md:w-1/3 h-full" bodyClsx="h-full">
                        <div className="flex flex-col justify-center h-full">
                            <div className="flex justify-between text-2xl mb-5">
                                <b>TOTAL:</b>
                                <b>
                                    {formatCurrency(
                                        PurOrdContext.draftOrder?.total
                                    )}
                                </b>
                            </div>
                            <Button
                                className="text-2xl w-full"
                                disabled={disableSubmitButton}
                                onClick={onSubmit}
                            >
                                {isEditPage ? 'Update Order' : 'Create Order'}
                            </Button>
                        </div>
                    </Card>
                </div>
            </UserLayout>

            <AddOrderProductDialog />
            <ConfirmDialog
                text={`Remove product?`}
                dialogKey="remove-order-product-dialog"
                onConfirm={() => {
                    PurOrdContext.setDraftOrder((prev) => {
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

const PurchaseOrderPage = () => (
    <ProductContextProvider>
        <VendorContextProvider>
            <PurchaseOrderContextProvider>
                <PurchaseOrderPageContent />
            </PurchaseOrderContextProvider>
        </VendorContextProvider>
    </ProductContextProvider>
)

export default PurchaseOrderPage
