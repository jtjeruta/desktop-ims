import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Button from '../../components/Button/Button'
import Card from '../../components/Card/Card'
import Table from '../../components/Table/Table'
import UserLayout from '../../components/UserLayout/UserLayout'
import { useAppContext } from '../../contexts/AppContext/AppContext'
import {
    ProductContextProvider,
    useProductContext,
} from '../../contexts/ProductContext/ProductContext'
import { Product } from '../../contexts/ProductContext/types'
import AddProductDialog from '../../components/AddProductDialog/AddProductDialog'
import Switch from '../../components/Switch/Switch'
import { formatDate } from '../../uitls/date-utils'
import { getProductWarehouseTotal } from '../../uitls/product-utils'
import { escapeRegExp, formatCurrency } from '../../uitls'
import { useWarehouseContext } from '../../contexts/WarehouseContext/WarehouseContext'
import SearchBar from '../../components/SearchBar/SearchBar'
import Pagination from '../../components/Pagination/Pagination'

const InventoryPageContent = () => {
    const AppContext = useAppContext()
    const ProductContext = useProductContext()
    const WarehouseContext = useWarehouseContext()
    const router = useRouter()
    const [statuses, setStatuses] = useState<
        { id: string; published: boolean }[]
    >([])
    const [search, setSearch] = useState<string>('')

    const filteredProducts = (ProductContext.products || []).filter(
        (product) => {
            const regex = new RegExp(escapeRegExp(search), 'igm')
            return [
                product.name,
                product.company,
                product.category,
                product.price,
                `#${product.sku}`,
                product.sku,
                product.subCategory,
                product.published ? 'available' : 'not available',
                formatDate(product.createdAt),
                getProductWarehouseTotal(WarehouseContext.warehouses, product),
                product.stock,
            ].some((item) => regex.test(`${item}`))
        }
    )

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
            <div className="flex justify-end mb-6 gap-3">
                <SearchBar
                    onSearch={(search) => setSearch(search)}
                    inputClass="!text-base h-full !bg-white"
                />
                <Button
                    onClick={() => AppContext.openDialog('add-product-dialog')}
                >
                    Add Product
                </Button>
            </div>

            <Card bodyClsx="!px-0 !py-0">
                <div className="overflow-x-auto">
                    <Table
                        rows={filteredProducts}
                        loading={AppContext.isLoading('list-products')}
                        columns={[
                            {
                                title: 'Created',
                                format: (row) => {
                                    const product = row as Product
                                    return formatDate(product.createdAt)
                                },
                                sort: (product) => product.createdAt,
                            },
                            {
                                title: 'Name',
                                bodyClsx: 'w-full',
                                format: (row) => {
                                    const product = row as Product
                                    return (
                                        <Link href={`/inventory/${product.id}`}>
                                            <span className="hover:text-teal-600 cursor-pointer">
                                                {product.name}
                                            </span>
                                        </Link>
                                    )
                                },
                                sort: (product) => product.name,
                            },
                            {
                                title: 'Price',
                                format: (row) => {
                                    const product = row as Product
                                    return formatCurrency(product.price)
                                },
                                sort: (product) => product.price,
                            },
                            {
                                title: 'Company',
                                key: 'company',
                                sort: (product) => product.company,
                            },
                            {
                                title: 'SKU',
                                format: (row) => {
                                    const product = row as Product
                                    return `#${product.sku}`
                                },
                            },
                            {
                                title: 'Category',
                                key: 'category',
                                sort: (product) => product.category,
                            },
                            {
                                title: 'WHS qty',
                                format: (row) => {
                                    const product = row as Product
                                    return getProductWarehouseTotal(
                                        WarehouseContext.warehouses,
                                        product
                                    )
                                },
                                sort: (product) =>
                                    getProductWarehouseTotal(
                                        WarehouseContext.warehouses,
                                        product as Product
                                    ),
                                bodyClsx: 'text-center',
                            },
                            {
                                title: 'STR qty',
                                format: (row) => {
                                    const product = row as Product
                                    return product.stock || 0
                                },
                                sort: (product) => product.stock || 0,
                                bodyClsx: 'text-center',
                            },
                            {
                                title: 'Available',
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
                                sort: (row) => {
                                    const product = row as Product
                                    return product.published ? -1 : 1
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
                </div>
                <Pagination totalRecords={100} className="p-3" />
            </Card>
            <AddProductDialog />
        </UserLayout>
    )
}

const InventoryPage = () => (
    <ProductContextProvider>
        <InventoryPageContent />
    </ProductContextProvider>
)

export default InventoryPage
