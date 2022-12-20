import { useEffect, useState } from 'react'
import Button from '../../components/Button/Button'
import Card from '../../components/Card/Card'
import PageHeader from '../../components/PageHeader/PageHeader'
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

const WarehousesPageContent = () => {
    const AppContext = useAppContext()
    const WarehouseContext = useWarehouseContext()
    const ProductContext = useProductContext()
    const [search, setSearch] = useState<string>('')

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
            <PageHeader
                breadcrumbs={[{ text: 'Warehouses' }]}
                searchbar={{ onSearch: (search) => setSearch(search) }}
                buttons={[
                    {
                        text: 'Add Warehouse',
                        onClick: () => {
                            WarehouseContext.setSelectedWarehouse(null)
                            AppContext.openDialog('add-edit-warehouse-dialog')
                        },
                    },
                ]}
            />

            <Card bodyClsx="!px-0 !py-0">
                <Table
                    rows={filteredWarehouses}
                    loading={AppContext.isLoading('list-warehouses')}
                    columns={[
                        {
                            title: 'Name',
                            format: (row) => {
                                const warehouse = row as Warehouse
                                return warehouse.name
                            },
                            sort: (warehouse) => warehouse.name,
                        },
                        {
                            title: 'Products',
                            format: (row) => {
                                const warehouse = row as Warehouse
                                return (
                                    <div className="flex flex-wrap gap-1">
                                        {warehouse.products
                                            .filter((wp) => wp.stock > 0)
                                            .map((whp) => (
                                                <div
                                                    className="border rounded border-blue-400 p-2"
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
                                    </div>
                                )
                            },
                        },
                        {
                            title: ' ',
                            bodyClsx: 'w-0',
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
