import moment from 'moment'
import Button from '../../components/Button/Button'
import Card from '../../components/Card/Card'
import PageHeader from '../../components/PageHeader/PageHeader'
import Table from '../../components/Table/Table'
import UserLayout from '../../components/UserLayout/UserLayout'
import { useAppContext } from '../../contexts/AppContext/AppContext'

export type Product = {
    id: string
    createdAt: number
    name: string
    markup: number
    brand: string
    sku: string
    category?: string
    subCategory?: string
    warehouseQty: number
    storeQty: number
    variants: ProductVariant[]
}

export type ProductVariant = {
    id: string
    name: string
    quantity: number
}

export const products: Product[] = [
    {
        id: '0',
        createdAt: 12312321,
        name: 'Product 1',
        markup: 120,
        brand: 'Brand 1',
        sku: '123123123',
        category: 'category 1',
        subCategory: 'sub category 1',
        warehouseQty: 0,
        storeQty: 0,
        variants: [
            {
                id: '0',
                name: 'Variant 1',
                quantity: 100,
            },
            {
                id: '1',
                name: 'Variant 1',
                quantity: 100,
            },
            {
                id: '2',
                name: 'Variant 1',
                quantity: 100,
            },
        ],
    },
]

const InventoryPage = () => {
    const AppContext = useAppContext()

    return (
        <UserLayout>
            <PageHeader title="Inventory" buttons={[{ text: 'Add Product' }]} />

            <Card bodyProps={{ className: 'p-0' }}>
                <Table
                    rows={products || []}
                    loading={AppContext.isLoading('list-users')}
                    columns={[
                        {
                            title: 'Created',
                            format: (row) => {
                                const product = row as Product
                                return moment(product.createdAt * 1000).format(
                                    'YYYY/MM/DD'
                                )
                            },
                        },
                        {
                            title: 'Name',
                            key: 'name',
                            className: 'w-full',
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
                            className: 'font-bold',
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
                            format: () => {
                                return <Button style="link">View</Button>
                            },
                        },
                    ]}
                />
            </Card>
        </UserLayout>
    )
}

export default InventoryPage
