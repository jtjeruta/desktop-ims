import { useState } from 'react'
import Button from '../../components/Button/Button'
import Card from '../../components/Card/Card'
import PageHeader from '../../components/PageHeader/PageHeader'
import Table from '../../components/Table/Table'
import UserLayout from '../../components/UserLayout/UserLayout'
import { useAppContext } from '../../contexts/AppContext/AppContext'
import { formatDate } from '../../uitls/date-utils'
import { Product } from '../../contexts/ProductContext/types'

type PurchaseOrder = {
    id: string
    products: {
        product: Product
        quantity: number
        itemPrice: number
        totalPrice: number
    }[]
    createdAt: number
    vendor: Vendor
    total: number
}

type Vendor = {
    id: string
    name: string
    phone: string
    address: string
}

const PurchaseOrdersPage = () => {
    const AppContext = useAppContext()
    const [search, setSearch] = useState<string>('')

    const orders: PurchaseOrder[] = [
        {
            id: '0',
            products: [
                {
                    product: {
                        id: '0',
                        name: 'Product 1',
                        price: 100,
                        brand: 'asd',
                        category: 'asdasd',
                        subCategory: 'asdasd',
                        aveUnitCost: 123,
                        createdAt: 123123,
                        sku: '123123',
                        published: true,
                        storeQty: 123123,
                        warehouses: [
                            { id: '123', name: '123213', quantity: 123 },
                        ],
                        variants: [],
                    },
                    quantity: 100,
                    itemPrice: 100,
                    totalPrice: 10000,
                },
            ],
            vendor: {
                id: '0',
                name: 'Some vendor',
                phone: '09052454667',
                address: 'iloilo city',
            },
            createdAt: 123123123123,
            total: 10000,
        },
    ]

    const filteredOrders = (orders || []).filter((order) => {
        const regex = new RegExp(search, 'igm')
        return [
            order.products.map((p) => p.product.name).join('-'),
            order.vendor.name,
            formatDate(order.createdAt),
        ].some((item) => regex.test(`${item}`))
    })

    return (
        <UserLayout>
            <PageHeader
                title="PurchaseOrders"
                searchbar={{ onSearch: (search) => setSearch(search) }}
                buttons={[
                    {
                        text: 'Add Order',
                        onClick: () =>
                            AppContext.openDialog('add-order-dialog'),
                    },
                ]}
            />

            <Card bodyClsx="!px-0 !py-0">
                <Table
                    rows={filteredOrders}
                    loading={AppContext.isLoading('list-orders')}
                    columns={[
                        {
                            title: 'Created',
                            format: (row) => {
                                const order = row as PurchaseOrder
                                return formatDate(order.createdAt)
                            },
                            sort: (order) => order.createdAt,
                        },
                        {
                            title: 'Vendor',
                            format: (row) => {
                                const order = row as PurchaseOrder
                                return order.vendor.name
                            },
                            sort: (order) => order.vendor.name,
                        },
                        {
                            title: 'Products',
                            format: (row) => {
                                const order = row as PurchaseOrder
                                return (
                                    <div>
                                        {order.products.map((p) => (
                                            <div>{p.product.name}</div>
                                        ))}
                                    </div>
                                )
                            },
                        },
                        {
                            title: 'Total',
                            format: (row) => {
                                const order = row as PurchaseOrder
                                return order.total
                            },
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

export default PurchaseOrdersPage
