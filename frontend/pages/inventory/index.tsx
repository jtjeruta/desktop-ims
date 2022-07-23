import { useCallback, useEffect, useState } from 'react'
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
import Switch from '../../components/Switch/Switch'

const InventoryPageContent = () => {
    const AppContext = useAppContext()
    const ProductContext = useProductContext()
    const router = useRouter()
    const [statuses, setStatuses] = useState<
        { id: string; published: boolean }[]
    >([])

    useEffect(() => {
        async function init() {
            if (ProductContext.products === null) {
                const response = await ProductContext.listProducts()
                if (response[0]) {
                    setStatuses(
                        response[1].map((product) => ({
                            id: product.id,
                            published: product.published,
                        }))
                    )
                }
            }
        }

        init()
    }, [ProductContext])

    const handleToggleStatus = useCallback(
        (productId: string, status: boolean) => async () => {
            setStatuses((prev) =>
                prev.map((s) => {
                    if (s.id !== productId) return s
                    return { ...s, published: status }
                })
            )

            const response = await ProductContext.updateProduct(productId, {
                published: status,
            })

            if (!response) {
                setStatuses((prev) =>
                    prev.map((s) => {
                        if (s.id !== productId) return s
                        return { ...s, published: !status }
                    })
                )
            }
        },
        [ProductContext]
    )

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
                            bodyClsx: 'w-full font-bold',
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
                            format: (row) => {
                                const product = row as Product
                                return product.warehouses.reduce(
                                    (acc, warehouse) =>
                                        acc + warehouse.quantity,
                                    0
                                )
                            },
                        },
                        {
                            title: 'Store qty',
                            format: (row) => {
                                const product = row as Product
                                return product.storeQty || 0
                            },
                        },
                        {
                            title: 'Status',
                            format: (row) => {
                                const product = row as Product
                                const status = statuses.find(
                                    (status) => status.id === product.id
                                )
                                return (
                                    <Switch
                                        toggled={!!status?.published}
                                        onClick={handleToggleStatus(
                                            product.id,
                                            !status?.published
                                        )}
                                    />
                                )
                            },
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
