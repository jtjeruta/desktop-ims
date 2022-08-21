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
import TextArea from '../../components/TextArea/TextArea'
import { formatCurrency } from '../../uitls'
import Button from '../../components/Button/Button'

const PurchaseOrderPageContent = () => {
    const AppContext = useAppContext()
    const PurOrdContext = usePurchaseOrderContext()
    const ProductContext = useProductContext()
    const router = useRouter()
    const [selectedProduct, setSelectedProduct] = useState<string | null>(null)

    useEffect(() => {
        async function init() {
            // fetch selected order
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

            // fetch products
            if (ProductContext.products === null) {
                await ProductContext.listProducts()
            }
        }

        init()
    }, [router, PurOrdContext, ProductContext])

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
                        <AddEditVendorForm />
                    </Card>
                    <OrderProductsTable
                        products={
                            PurOrdContext.selectedOrder?.products ??
                            PurOrdContext.draftOrder.products
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
                    <Card cardClsx="grow">
                        <TextArea label="Remarks" name="remarks" />
                    </Card>
                    <Card cardClsx="w-full md:w-1/3 h-full">
                        <div className="flex flex-col justify-center h-full">
                            <div className="flex justify-between text-2xl mb-5">
                                <b>TOTAL:</b>
                                <b>
                                    {formatCurrency(
                                        PurOrdContext.draftOrder.total
                                    )}
                                </b>
                            </div>
                            <Button className="text-2xl w-full">Save</Button>
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
        <PurchaseOrderContextProvider>
            <PurchaseOrderPageContent />
        </PurchaseOrderContextProvider>
    </ProductContextProvider>
)

export default PurchaseOrderPage
