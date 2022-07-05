import { useEffect } from 'react'
import { useRouter } from 'next/router'
import moment from 'moment'
import Button from '../../components/Button/Button'
import Card from '../../components/Card/Card'
import PageHeader from '../../components/PageHeader/PageHeader'
import Table from '../../components/Table/Table'
import UserLayout from '../../components/UserLayout/UserLayout'
import { useAppContext } from '../../contexts/AppContext/AppContext'
import {
    ProductContextProvider,
    useProductContext,
} from '../../contexts/ProductContext/ProductContext'
import { Product } from '../../contexts/ProductContext/types'
import AddEditProductDialog from '../../components/AddProductDialog/AddProductDialog'

const InventoryPageContent = () => {
    const AppContext = useAppContext()
    const ProductContext = useProductContext()
    const router = useRouter()

    useEffect(() => {
        ProductContext.products === null && ProductContext.listProducts()
    }, [ProductContext])

    return (
        <UserLayout>
            <PageHeader
                title="Inventory"
                buttons={[
                    {
                        text: 'Add Product',
                        onClick: () =>
                            AppContext.openDialog('add-product-dialog'),
                    },
                ]}
            />

            <Card bodyClsx="!px-0 !py-0">
                <Table
                    rows={ProductContext.products || []}
                    loading={AppContext.isLoading('list-products')}
                    columns={[
                        {
                            title: 'Created',
                            format: (row) => {
                                const product = row as Product
                                return moment(product.createdAt * 1000).format(
                                    'MMM DD, YYYY'
                                )
                            },
                        },
                        {
                            title: 'Name',
                            key: 'name',
                            bodyClsx: 'w-full',
                        },
                        {
                            title: 'Price',
                            key: 'price',
                        },
                        {
                            title: 'Markup',
                            key: 'markup',
                        },
                        {
                            title: 'Brand',
                            key: 'brand',
                        },
                        {
                            title: 'SKU',
                            format: (row) => {
                                const product = row as Product
                                return `#${product.sku}`
                            },
                            bodyClsx: 'font-bold',
                        },
                        {
                            title: 'Category',
                            key: 'category',
                        },
                        {
                            title: 'Warehouse qty',
                            key: 'warehouseQty',
                        },
                        {
                            title: 'Store qty',
                            key: 'storeQty',
                        },
                        {
                            title: ' ',
                            format: (row) => {
                                const product = row as Product
                                return (
                                    <Button
                                        style="link"
                                        onClick={() =>
                                            router.push(
                                                `/inventory/${product.id}`
                                            )
                                        }
                                    >
                                        View
                                    </Button>
                                )
                            },
                        },
                    ]}
                />
            </Card>
            <AddEditProductDialog />
        </UserLayout>
    )
}

const InventoryPage = () => (
    <ProductContextProvider>
        <InventoryPageContent />
    </ProductContextProvider>
)

export default InventoryPage
