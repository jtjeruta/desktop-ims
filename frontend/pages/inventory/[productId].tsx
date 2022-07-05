import { useEffect } from 'react'
import PageHeader from '../../components/PageHeader/PageHeader'
import UserLayout from '../../components/UserLayout/UserLayout'
import AddEditProductForm from '../../components/AddEditProductForm/AddEditProductForm'
import ManageProductVariants from '../../components/ManageProductVariants/ManageProductVariants'
import ProductDetailsCard from '../../components/ProductDetailsCard/ProductDetailsCard'
import {
    ProductContextProvider,
    useProductContext,
} from '../../contexts/ProductContext/ProductContext'
import { useRouter } from 'next/router'
import Card from '../../components/Card/Card'

const ProductPageContent = () => {
    const ProductContext = useProductContext()
    const router = useRouter()

    useEffect(() => {
        if (router.query.productId && ProductContext.product === null) {
            ProductContext.getProduct(router.query.productId as string)
        }
    }, [router.query, ProductContext])

    return (
        <UserLayout>
            <PageHeader title={<code>#{ProductContext.product?.sku}</code>} />
            <div className="flex gap-4 pb-4">
                <Card cardClsx="grow basis-0">
                    <AddEditProductForm />
                </Card>
                <ProductDetailsCard />
            </div>
            {/* <ManageProductVariants product={ProductContext.product} /> */}
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
