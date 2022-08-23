import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import PageHeader from '../../components/PageHeader/PageHeader'
import UserLayout from '../../components/UserLayout/UserLayout'
import {
    PurchaseOrderContextProvider,
    usePurchaseOrderContext,
} from '../../contexts/PurchaseOrderContext/PurchaseOrderContext'
import Card from '../../components/Card/Card'
import AddEditVendorForm from '../../components/AddEditVendorForm/AddEditVendorForm'
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
import { CreateUpdatePurchaseOrderDoc } from '../../contexts/PurchaseOrderContext/types'
import {
    useVendorContext,
    VendorContextProvider,
} from '../../contexts/VendorContext/VendorContext'
import OrderRemarksForm from '../../components/OrderRemarksForm/OrderRemarksForm'
import VendorSelect from '../../components/VendorSelect/VendorSelect'
import { Vendor } from '../../contexts/VendorContext/types'

const PurchaseOrderPageContent = () => {
    const AppContext = useAppContext()
    const PurOrdContext = usePurchaseOrderContext()
    const ProductContext = useProductContext()
    const VendorContext = useVendorContext()
    const router = useRouter()
    const [selectedProduct, setSelectedProduct] = useState<string | null>(null)
    const isEditPage = ![undefined, 'new', ['']].includes(router.query.orderId)

    const disableSubmitButton =
        !VendorContext.selectedVendor &&
        !VendorContext.draftVendor &&
        (isEditPage
            ? (PurOrdContext.selectedOrder?.products.length ?? 0) <= 0
            : PurOrdContext.draftOrder.products.length <= 0)

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
                    VendorContext.setSelectedVendor(response[1].vendor)
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

    const onSubmit = async () => {
        let vendor: Vendor | null = null

        if (isEditPage) {
            vendor = VendorContext.selectedVendor
        } else {
            if (!VendorContext.draftVendor) return

            const vendorRes = await VendorContext.createVendor(
                VendorContext.draftVendor
            )

            vendor = vendorRes[0] ? vendorRes[1] : null
        }
        if (!vendor) return

        if (isEditPage) {
            handleUpdatePurOrd(vendor)
        } else {
            handleCreatePurOrd(vendor)
        }
    }

    const handleUpdatePurOrd = async (vendor: Vendor) => {
        const order = PurOrdContext.selectedOrder
        if (!order) return

        const data: CreateUpdatePurchaseOrderDoc = {
            products: order.products.map((product) => ({
                id: product.id,
                product: product.product.id,
                quantity: product.quantity,
                itemPrice: product.itemPrice,
                warehouse: product.warehouse?.id ?? null,
            })),
            vendor: vendor.id,
            remarks: order.remarks ?? '',
        }

        await PurOrdContext.updateOrder(order.id, data)
    }

    const handleCreatePurOrd = async (vendor: Vendor) => {
        const order = PurOrdContext.draftOrder

        const data: CreateUpdatePurchaseOrderDoc = {
            products: order.products.map((product) => ({
                id: product.id,
                product: product.product.id,
                quantity: product.quantity,
                itemPrice: product.itemPrice,
                warehouse: product.warehouse?.id ?? null,
            })),
            vendor: vendor.id,
            remarks: order.remarks ?? '',
        }

        const purOrdRes = await PurOrdContext.createOrder(data)

        if (!purOrdRes[0]) return
        router.push(`/purchase-orders/${purOrdRes[1].id}`)
    }

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

                <div className="flex flex-row gap-3 mb-3">
                    <Card title="Vendor Details">
                        <>
                            {PurOrdContext.selectedOrder ? (
                                <VendorSelect />
                            ) : (
                                <AddEditVendorForm />
                            )}
                        </>
                    </Card>
                    <OrderProductsTable
                        products={
                            isEditPage
                                ? PurOrdContext.selectedOrder?.products || []
                                : PurOrdContext.draftOrder.products
                        }
                        onAdd={() => {
                            AppContext.openDialog('add-order-product-dialog')
                        }}
                        onDelete={(id) => () => {
                            setSelectedProduct(id)
                            AppContext.openDialog('remove-order-product-dialog')
                        }}
                    />
                </div>
                <div className="flex gap-3">
                    <OrderRemarksForm draft={!isEditPage} />
                    <Card cardClsx="w-full md:w-1/3 h-full" bodyClsx="h-full">
                        <div className="flex flex-col justify-center h-full">
                            <div className="flex justify-between text-2xl mb-5">
                                <b>TOTAL:</b>
                                <b>
                                    {formatCurrency(
                                        PurOrdContext.selectedOrder?.total ??
                                            PurOrdContext.draftOrder.total
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

            <AddOrderProductDialog draft={!isEditPage} />
            <ConfirmDialog
                text={`Remove product?`}
                dialogKey="remove-order-product-dialog"
                onConfirm={() => {
                    if (isEditPage) {
                        PurOrdContext.setSelectedOrder((prev) => {
                            if (!prev) return null
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
                    } else {
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
                    }
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
