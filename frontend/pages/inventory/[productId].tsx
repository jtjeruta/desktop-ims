import PageHeader from '../../components/PageHeader/PageHeader'
import UserLayout from '../../components/UserLayout/UserLayout'
import AddEditProductForm from '../../components/AddEditProductForm/AddEditProductForm'
import { products } from '.'
import ManageProductVariants from '../../components/ManageProductVariants/ManageProductVariants'

const product = products[0]

const ProductPage = () => {
    return (
        <UserLayout>
            <PageHeader title={`#${product.sku}`} />

            <div className="flex gap-4">
                <AddEditProductForm product={product} />
                <ManageProductVariants product={product} />
            </div>
            {/* <Details />
            <History /> */}
        </UserLayout>
    )
}

export default ProductPage
