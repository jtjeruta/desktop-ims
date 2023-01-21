import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import clsx from 'clsx'
import Button from '../../components/Button/Button'
import Card from '../../components/Card/Card'
import Table from '../../components/Table/Table'
import UserLayout from '../../components/UserLayout/UserLayout'
import { useAppContext } from '../../contexts/AppContext/AppContext'
import {
    WarehouseContextProvider,
    useWarehouseContext,
} from '../../contexts/WarehouseContext/WarehouseContext'
import { Warehouse } from '../../contexts/WarehouseContext/types'
import { escapeRegExp } from '../../uitls'
import AddEditWarehouseDialog from '../../components/AddEditWarehouseDialog/AddEditWarehouseDialog'
import TransferStockDialog from '../../components/TransferStockDialog/TransferStockDialog'
import {
    ProductContextProvider,
    useProductContext,
} from '../../contexts/ProductContext/ProductContext'
import SearchBar from '../../components/SearchBar/SearchBar'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import { FaPlus } from 'react-icons/fa'

const WarehousesPageContent = () => {
    const AppContext = useAppContext()
    const WarehouseContext = useWarehouseContext()
    const ProductContext = useProductContext()
    const router = useRouter()
    const md = useMediaQuery('md')
    const [search, setSearch] = useState<string>('')
    const [openedWarehouse, setOpenedWarehouse] = useState<string | null>(null)
    const maxProductsToShow = md ? 3 : 1
    const [page, setPage] = useState<number>(0)

    const filteredWarehouses = (WarehouseContext.warehouses || []).filter(
        (warehouse) => {
            const regex = new RegExp(escapeRegExp(search), 'igm')

            const products = warehouse.products
                .filter((product) => product.stock > 0)
                .map((product) => product.source.name)

            return [warehouse.name, ...products].some((item) =>
                regex.test(`${item}`)
            )
        }
    )

    useEffect(() => {
        async function init() {
            await Promise.all([
                WarehouseContext.listWarehouses(),
                ProductContext.listProducts(),
            ])
        }

        init()
    }, [])

    return (
        <UserLayout>
            <div className="flex justify-end mb-6 gap-3">
                <SearchBar
                    onSearch={(search) => {
                        setSearch(search)
                        setPage(0)
                    }}
                    inputClass="!text-base h-full !bg-white"
                />
                <Button
                    onClick={() => {
                        WarehouseContext.setSelectedWarehouse(null)
                        AppContext.openDialog('add-edit-warehouse-dialog')
                    }}
                >
                    {!md ? <FaPlus /> : 'Add Warehouse'}
                </Button>
            </div>

            <Card bodyClsx="!px-0 !py-0 overflow-x-auto">
                <Table
                    page={page}
                    handlePageChange={(newPage) => setPage(newPage)}
                    rows={filteredWarehouses}
                    loading={AppContext.isLoading('list-warehouses')}
                    columns={[
                        {
                            title: 'Name',
                            format: (row) => {
                                const warehouse = row as Warehouse
                                return (
                                    <div
                                        className="hover:text-teal-600 cursor-pointer"
                                        onClick={() => {
                                            WarehouseContext.setSelectedWarehouse(
                                                warehouse
                                            )
                                            AppContext.openDialog(
                                                'add-edit-warehouse-dialog'
                                            )
                                        }}
                                    >
                                        {warehouse.name}
                                    </div>
                                )
                            },
                            sort: (warehouse) => warehouse.name,
                            bodyClsx: 'align-top',
                        },
                        {
                            title: 'Products',
                            format: (row) => {
                                const warehouse = row as Warehouse
                                const filteredProducts =
                                    warehouse.products.filter(
                                        (wp) => wp.stock > 0
                                    )

                                const searchedProducts =
                                    filteredProducts.filter((product) =>
                                        new RegExp(search, 'igm').test(
                                            product.source.name
                                        )
                                    )

                                const isOpen = warehouse.id === openedWarehouse
                                return (
                                    <div className="flex flex-col gap-1">
                                        <div
                                            className={clsx([
                                                'flex gap-1 transition-all max-h-12 overflow-hidden duration-500',
                                                isOpen && '!max-h-0',
                                            ])}
                                        >
                                            {searchedProducts
                                                .filter(
                                                    (_, i) =>
                                                        i < maxProductsToShow
                                                )
                                                .map((whp) => (
                                                    <div
                                                        className="flex overflow-hidden border rounded border-blue-400 p-2 cursor-pointer hover:bg-gray-50"
                                                        key={whp.source.id}
                                                        onClick={() =>
                                                            router.push(
                                                                `/inventory/${whp.source.id}`
                                                            )
                                                        }
                                                    >
                                                        <span className="truncate">
                                                            {whp.source.name}
                                                        </span>
                                                        <span className="grow ml-2 bg-blue-400 rounded px-2 text-white">
                                                            {whp.stock}
                                                        </span>
                                                    </div>
                                                ))}

                                            {filteredProducts.length >
                                                maxProductsToShow && (
                                                <Button
                                                    className="grow border rounded border-blue-400 p-2"
                                                    onClick={() =>
                                                        setOpenedWarehouse(
                                                            warehouse.id
                                                        )
                                                    }
                                                >
                                                    <span>
                                                        {filteredProducts.length -
                                                            maxProductsToShow}{' '}
                                                        more...
                                                    </span>
                                                </Button>
                                            )}
                                        </div>
                                        <div
                                            className={clsx([
                                                'flex gap-1 flex-col transition-all overflow-hidden max-h-0 duration-500',
                                                isOpen && '!max-h-screen',
                                            ])}
                                        >
                                            {searchedProducts.map((whp) => (
                                                <div
                                                    className="flex justify-between border rounded border-blue-400 p-2"
                                                    key={whp.source.id}
                                                >
                                                    <span>
                                                        {whp.source.name}
                                                    </span>
                                                    <span className="ml-2 bg-blue-400 rounded px-2 text-white">
                                                        {whp.stock}
                                                    </span>
                                                </div>
                                            ))}
                                            <Button
                                                style="outline"
                                                color="secondary"
                                                onClick={() =>
                                                    setOpenedWarehouse(null)
                                                }
                                            >
                                                Show less...
                                            </Button>
                                        </div>
                                    </div>
                                )
                            },
                            bodyClsx: 'max-w-xs',
                        },
                        {
                            title: ' ',
                            bodyClsx: 'w-0 align-top',
                            format: (row) => {
                                const warehouse = row as Warehouse
                                return (
                                    <div className="flex">
                                        <Button
                                            style="link"
                                            onClick={() => {
                                                WarehouseContext.setSelectedWarehouse(
                                                    warehouse
                                                )
                                                AppContext.openDialog(
                                                    'transfer-stock-dialog'
                                                )
                                            }}
                                        >
                                            Transfer Stock
                                        </Button>
                                        <Button
                                            style="link"
                                            onClick={() => {
                                                WarehouseContext.setSelectedWarehouse(
                                                    warehouse
                                                )
                                                AppContext.openDialog(
                                                    'add-edit-warehouse-dialog'
                                                )
                                            }}
                                        >
                                            Edit
                                        </Button>
                                    </div>
                                )
                            },
                        },
                    ]}
                />
            </Card>
            <AddEditWarehouseDialog />
            <TransferStockDialog showProductSelect />
        </UserLayout>
    )
}

const WarehousesPage = () => {
    return (
        <WarehouseContextProvider>
            <ProductContextProvider>
                <WarehousesPageContent />
            </ProductContextProvider>
        </WarehouseContextProvider>
    )
}

export default WarehousesPage
