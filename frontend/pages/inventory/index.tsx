import moment from 'moment'
import Button from '../../components/Button/Button'
import PageHeader from '../../components/PageHeader/PageHeader'
import Table from '../../components/Table/Table'
import UserLayout from '../../components/UserLayout/UserLayout'
import { useAppContext } from '../../contexts/AppContext/AppContext'

type Product = {
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
}

const products: Product[] = [
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
    },
]

const InventoryPage = () => {
    const AppContext = useAppContext()

    return (
        <UserLayout>
            <PageHeader title="Inventory" buttons={[{ text: 'Add Product' }]} />

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
                        key: 'sku',
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
                            return (
                                <div className="flex gap-10">
                                    <Button style="link">Edit</Button>
                                </div>
                            )
                        },
                    },
                ]}
            />
        </UserLayout>
    )
}

export default InventoryPage
