import { useCallback, useLayoutEffect, useState } from 'react'
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
import { formatDate } from '../../utils/date-utils'
import { getProductWarehouseTotal } from '../../utils/product-utils'
import { escapeRegExp, formatCurrency } from '../../utils'
import {
    useWarehouseContext,
    WarehouseContextProvider,
} from '../../contexts/WarehouseContext/WarehouseContext'
import SearchBar from '../../components/SearchBar/SearchBar'
import Dropdown from '../../components/Dropdown/Dropdown'
import Alert from '../../components/Alert/Alert'
import { ActionButton } from '../../components/ActionButton/ActionButton'

type Filters = {
    showDrafted: boolean
    lowStockedOnly: boolean
}

const InventoryPageContent = () => {
    const AppContext = useAppContext()
    const ProductContext = useProductContext()
    const WarehouseContext = useWarehouseContext()
    const router = useRouter()
    const [statuses, setStatuses] = useState<
        { id: string; published: boolean }[]
    >([])
    const [search, setSearch] = useState<string>('')
    const [page, setPage] = useState<number>(0)
    const [filters, setFilters] = useState<Filters>({
        showDrafted: false,
        lowStockedOnly: false,
    })

    const filteredProducts = (ProductContext.products || [])
        .filter((product) => {
            const regex = new RegExp(escapeRegExp(search), 'igm')
            return [
                product.name,
                product.company,
                product.category,
                `#${product.sku}`,
                product.sku,
                formatDate(product.createdAt),
                getProductWarehouseTotal(WarehouseContext.warehouses, product),
                product.stock,
            ].some((item) => regex.test(`${item}`))
        })
        .filter((product) => filters.showDrafted || product.published)
        .filter((product) => {
            if (!filters.lowStockedOnly) return true
            const warehouseTotal = getProductWarehouseTotal(
                WarehouseContext.warehouses,
                product
            )
            return warehouseTotal + product.stock <= product.reorderPoint
        })

    const toggleFilter = useCallback((key: keyof Filters) => {
        setFilters((prev) => ({ ...prev, [key]: !prev[key] }))
        setPage(0)
    }, [])

    const options = [
        {
            label: 'Show un-available products',
            toggled: filters.showDrafted,
            onClick: () => toggleFilter('showDrafted'),
        },
        {
            label: 'Low stocked products only',
            toggled: filters.lowStockedOnly,
            onClick: () => toggleFilter('lowStockedOnly'),
        },
    ]

    useLayoutEffect(() => {
        async function init() {
            setPage(+(router.query.page ?? 0))
            const [productsRes, warehouseRes] = await Promise.all([
                ProductContext.listProducts(),
                WarehouseContext.listWarehouses(),
            ])

            if (productsRes[0]) {
                setStatuses(
                    productsRes[1].map((product) => ({
                        id: product.id,
                        published: product.published,
                    }))
                )
            }

            if (!productsRes[0] || !warehouseRes[0]) {
                router.push('/500')
            }
        }

        init()
    }, [])

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

    const lowStockedProducts =
        ProductContext.products?.filter((product) => {
            const warehouseTotal = getProductWarehouseTotal(
                WarehouseContext.warehouses,
                product
            )
            return (
                product.published &&
                warehouseTotal + product.stock <= product.reorderPoint
            )
        }) ?? []

    return (
        <UserLayout>
            <div className="flex justify-end mb-4 gap-3">
                <SearchBar
                    onSearch={(search) => {
                        setSearch(search)
                        setPage(0)
                    }}
                    inputClass="!text-base h-full !bg-white"
                />
                <Dropdown>
                    <div className="flex flex-col gap-3">
                        {options.map((option) => (
                            <div key={option.label} className="flex gap-2">
                                <Switch
                                    toggled={option.toggled}
                                    onClick={option.onClick}
                                />
                                <span className="block w-max">
                                    {option.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </Dropdown>
                <Button
                    className="hidden md:block"
                    onClick={() => AppContext.openDialog('add-product-dialog')}
                >
                    Add Product
                </Button>
            </div>

            {lowStockedProducts.length > 0 && (
                <Alert
                    type="warning"
                    title={`${lowStockedProducts.length} low stocked products`}
                    content={
                        <div>
                            Click here to show all{' '}
                            {filters.lowStockedOnly
                                ? 'products'
                                : 'low stocked products'}
                        </div>
                    }
                    onClick={() =>
                        setFilters((prev) => ({
                            ...prev,
                            lowStockedOnly: !prev.lowStockedOnly,
                        }))
                    }
                    className="mb-4"
                />
            )}

            <Card bodyClsx="!px-0 !py-0">
                <Table
                    page={page}
                    handlePageChange={(newPage) => setPage(newPage)}
                    rows={filteredProducts}
                    loading={
                        AppContext.isLoading('list-products') ||
                        AppContext.isLoading('list-warehouses')
                    }
                    defaultSort={1}
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
                                    <span className="hover:text-teal-600 cursor-pointer">
                                        <Link href={`/inventory/${product.id}`}>
                                            {product.name}
                                        </Link>
                                    </span>
                                )
                            },
                            sort: (product) => product.name,
                        },
                        {
                            title: 'Selling Price',
                            format: (row) => {
                                const product = row as Product
                                return formatCurrency(product.sellingPrice)
                            },
                            sort: (product) => product.price,
                        },
                        {
                            title: 'Cost Price',
                            format: (row) => {
                                const product = row as Product
                                return formatCurrency(product.costPrice)
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
                                const stock = getProductWarehouseTotal(
                                    WarehouseContext.warehouses,
                                    product
                                )
                                return stock > 5 ? (
                                    stock
                                ) : (
                                    <span className="text-red-500">
                                        {stock}
                                    </span>
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
                                const stock = product.stock || 0
                                return stock > 5 ? (
                                    stock
                                ) : (
                                    <span className="text-red-500">
                                        {stock}
                                    </span>
                                )
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
                            bodyClsx: !filters.showDrafted ? 'hidden' : '',
                            headerClsx: !filters.showDrafted ? 'hidden' : '',
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
            <AddProductDialog />
            <ActionButton
                onClick={() => AppContext.openDialog('add-product-dialog')}
            />
        </UserLayout>
    )
}

const InventoryPage = () => (
    <ProductContextProvider>
        <WarehouseContextProvider>
            <InventoryPageContent />
        </WarehouseContextProvider>
    </ProductContextProvider>
)

export default InventoryPage
