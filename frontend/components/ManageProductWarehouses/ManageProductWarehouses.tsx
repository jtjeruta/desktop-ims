import { useCallback } from 'react'
import { useProductContext } from '../../contexts/ProductContext/ProductContext'
import Button from '../Button/Button'
import Table from '../Table/Table'
import Card from '../Card/Card'
import { useAppContext } from '../../contexts/AppContext/AppContext'
import AddWarehouseDialog from '../AddWarehouseDialog/AddWarehouseDialog'
import ConfirmDialog from '../ConfirmDialog/ConfirmDialog'
import { Warehouse } from '../../contexts/ProductContext/types'
import OptionsButton from '../OptionsButton/OptionsButton'

const ManageProductWarehouses = () => {
    const AppContext = useAppContext()
    const ProductContext = useProductContext()

    const handleDelete = useCallback(
        (warehouse: Warehouse) => () => {
            ProductContext.setWarehouseToDelete(warehouse)
            AppContext.openDialog('delete-warehouse-dialog')
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
                                loading={!ProductContext.product}
                                rows={ProductContext.product?.warehouses || []}
                                columns={[
                                    {
                                        title: 'Warehouse',
                                        key: 'name',
                                    },
                                    {
                                        title: 'Qty',
                                        key: 'quantity',
                                    },
                                    {
                                        title: 'Actions',
                                        format: (row) => {
                                            const warehouse = row as Warehouse
                                            return (
                                                <OptionsButton
                                                    options={[
                                                        {
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
                                        'add-warehouse-dialog'
                                    )
                                }}
                            >
                                Add
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>
            <AddWarehouseDialog />
            <ConfirmDialog
                text={`Delete warehouse ${ProductContext.warehouseToDelete?.name}?`}
                dialogKey="delete-warehouse-dialog"
                onConfirm={async () => {
                    if (ProductContext.warehouseToDelete) {
                        await ProductContext.deleteWarehouse(
                            ProductContext.warehouseToDelete?.id
                        )
                        AppContext.closeDialog()
                    }
                }}
                loading={AppContext.isLoading('delete-warehouse')}
            />
        </>
    )
}

export default ManageProductWarehouses
