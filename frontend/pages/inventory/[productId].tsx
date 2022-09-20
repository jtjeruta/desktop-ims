import { useCallback, useEffect, useState } from 'react'
import PageHeader from '../../components/PageHeader/PageHeader'
import UserLayout from '../../components/UserLayout/UserLayout'
import AddEditProductForm from '../../components/AddEditProductForm/AddEditProductForm'
import ProductDetailsCard from '../../components/ProductDetailsCard/ProductDetailsCard'
import {
    ProductContextProvider,
    useProductContext,
} from '../../contexts/ProductContext/ProductContext'
import { useRouter } from 'next/router'
import Card from '../../components/Card/Card'
import { useAppContext } from '../../contexts/AppContext/AppContext'
import ManageProductVariants from '../../components/ManageProductVariants/ManageProductVariants'
import ManageProductWarehouses from '../../components/ManageProductWarehouses/ManageProductWarehouses'
import Alert from '../../components/Alert/Alert'

const ProductPageContent = () => {
    const AppContext = useAppContext()
    const ProductContext = useProductContext()
    const router = useRouter()
    const [published, setPublished] = useState<boolean>(false)

    useEffect(() => {
        async function init() {
            if (router.query.productId && ProductContext.product === null) {
                const response = await ProductContext.getProduct(
                    router.query.productId as string
                )

                if (response[0]) {
                    setPublished(response[1].published)
                } else if (response[1].status === 404) {
                    router.replace('/404')
                }
            }
        }

        init()
    }, [router, ProductContext])

    const handleToggleSwitch = useCallback(async () => {
        if (!ProductContext.product) return
        const value = !published
        setPublished(value)
        const response = await ProductContext.updateProduct(
            ProductContext.product.id,
            { published: value }
        )
        !response[0] && setPublished(!value)
    }, [ProductContext, published])

    return (
        <UserLayout>
            <PageHeader
                headerClsx="!flex-row"
                title={<code>#{ProductContext.product?.sku}</code>}
                switches={[
                    {
                        toggled: published,
                        toggledText: 'Available',
                        unToggledText: 'Not available',
                        onClick: handleToggleSwitch,
                        loading: AppContext.isLoading('update-product'),
                    },
                ]}
            />
            {!ProductContext.product?.published && (
                <Alert
                    type="info"
                    title="NOT AVAILABLE"
                    content={
                        <span>
                            Product is currently set to <b>NOT AVAILABLE</b> and
                            will not be available for purchase.
                        </span>
                    }
                    className="mb-4"
                />
            )}
            <div className="flex gap-4 pb-4 flex-col md:flex-row">
                <Card cardClsx="grow basis-0">
                    <AddEditProductForm type="update" />
                </Card>
                <ProductDetailsCard />
            </div>
            <div className="flex gap-4 pb-4 flex-col md:flex-row">
                <ManageProductVariants />
                <ManageProductWarehouses />
            </div>
            {/* <div className="basis-0 grow" /> */}
            {/* <History /> */}
        </UserLayout>
    )
}

const ProductPage = () => (
    <ProductContextProvider>
        <ProductPageContent />
    </ProductContextProvider>
)

export default ProductPage
