import { useCallback, useEffect, useState } from 'react'
import { useProductContext } from '../../contexts/ProductContext/ProductContext'
import Button from '../Button/Button'
import Table from '../Table/Table'
import Card from '../Card/Card'
import { useAppContext } from '../../contexts/AppContext/AppContext'
import { Warehouse } from '../../contexts/WarehouseContext/types'
import OptionsButton from '../OptionsButton/OptionsButton'
import { FaRegTrashAlt } from 'react-icons/fa'
import { BiTransfer } from 'react-icons/bi'
import TransferStockDialog from '../TransferStockDialog/TransferStockDialog'
import { useWarehouseContext } from '../../contexts/WarehouseContext/WarehouseContext'
import {
    getProductWarehouses,
    ProductWarehouse,
} from '../../uitls/product-utils'

const ManageProductWarehouses = () => {
    const AppContext = useAppContext()
    const ProductContext = useProductContext()
    const WarehouseContext = useWarehouseContext()
    const isLoading =
        ProductContext.product == null || WarehouseContext.warehouses == null
    const [warehouses, setWarehouses] = useState<ProductWarehouse[]>([])

    useEffect(() => {
        if (isLoading) return
        setWarehouses(
            getProductWarehouses(
                WarehouseContext.warehouses,
                ProductContext.product
            )
        )
    }, [ProductContext.product, WarehouseContext.warehouses])

    const handleDelete = useCallback(
        (warehouse: Warehouse) => () => {
            WarehouseContext.setSelectedWarehouse(warehouse)
            AppContext.openDialog('delete-warehouse-dialog')
        },
        [AppContext, ProductContext]
    )

    const handleTransferStock = useCallback(
        (warehouse: Warehouse) => () => {
            WarehouseContext.setSelectedWarehouse(warehouse)
            AppContext.openDialog('transfer-stock-dialog')
        },
        [AppContext, ProductContext]
    )

    return (
        <>
            <div className="flex grow basis-0">
                <Card cardClsx="w-full" bodyClsx="!px-0 !py-0 h-full">
                    <div className="flex flex-col h-full">
                        <div className="grow">
                            <Table
                                loading={isLoading}
                                rows={warehouses}
                                columns={[
                                    {
                                        title: 'Stock Location',
                                        key: 'name',
                                    },
                                    {
                                        title: 'Stock Qty',
                                        key: 'stock',
                                    },
                                    {
                                        title: 'Actions',
                                        format: (row) => {
                                            const warehouse = row as Warehouse
                                            return (
                                                <OptionsButton
                                                    options={[
                                                        {
                                                            icon: BiTransfer,
                                                            label: 'Transfer Stock',
                                                            onClick:
                                                                handleTransferStock(
                                                                    warehouse
                                                                ),
                                                        },
                                                        {
                                                            icon: FaRegTrashAlt,
                                                            label: 'Delete Warehouse',
                                                            onClick:
                                                                handleDelete(
                                                                    warehouse
                                                                ),
                                                        },
                                                    ]}
                                                />
                                            )
                                        },
                                        headerClsx: 'text-right',
                                        bodyClsx: 'flex justify-end',
                                    },
                                ]}
                            />
                        </div>
                        <div className="flex justify-end p-4">
                            <Button
                                disabled={!ProductContext.product}
                                onClick={() => {
                                    AppContext.openDialog(
                                        'transfer-stock-dialog'
                                    )
                                }}
                            >
                                Add
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>
            <TransferStockDialog />
        </>
    )
}

export default ManageProductWarehouses
