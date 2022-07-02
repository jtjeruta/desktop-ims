import PageHeader from '../../components/PageHeader/PageHeader'
import UserLayout from '../../components/UserLayout/UserLayout'
import AddEditProductForm from '../../components/AddEditProductForm/AddEditProductForm'
import { products } from '.'
import ManageProductVariants from '../../components/ManageProductVariants/ManageProductVariants'
import ProductDetailsCard from '../../components/ProductDetailsCard/ProductDetailsCard'

const product = products[0]

const ProductPage = () => {
    return (
        <UserLayout>
            <PageHeader title={`#${product.sku}`} />

            <div className="flex gap-4 pb-4">
                <AddEditProductForm product={product} />
                <ProductDetailsCard product={product} />
            </div>
            <ManageProductVariants product={product} />
            {/* <div className="basis-0 grow" /> */}
            {/* <History /> */}
        </UserLayout>
    )
}

export default ProductPage
