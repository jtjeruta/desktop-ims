import { FC, useState } from 'react'
import { FaTrash } from 'react-icons/fa'
import { useAppContext } from '../../contexts/AppContext/AppContext'
import { Product } from '../../contexts/ProductContext/types'
import { Warehouse } from '../../contexts/WarehouseContext/types'
import { formatCurrency } from '../../utils'
import Button from '../Button/Button'
import Card from '../Card/Card'
import Table from '../Table/Table'

type Props = {
    products: {
        id: string
        product: Product
        quantity: number
        itemPrice: number
        totalPrice: number
        warehouse: Warehouse | null
    }[]
    onAdd: () => void
    onDelete: (name: string) => () => void
}

const OrderProductsTable: FC<Props> = (props) => {
    const AppContext = useAppContext()
    const [page, setPage] = useState<number>(0)

    return (
        <Card cardClsx="grow overflow-x-hidden" bodyClsx="!px-0 !py-0 h-full">
            <div className="flex flex-col h-full">
                <div className="grow overflow-x-auto">
                    <Table
                        page={page}
                        handlePageChange={(newPage) => setPage(newPage)}
                        rows={props.products || []}
                        columns={[
                            {
                                title: 'QTY',
                                format: (row) => row.quantity,
                                bodyClsx: 'text-right',
                            },
                            {
                                title: 'Unit',
                                format: (row) => row.variant?.name ?? 'default',
                            },
                            {
                                title: 'Product',
                                format: (row) => row.product.name,
                                headerClsx: 'w-full',
                            },
                            {
                                title: 'Selling Price',
                                format: (row) => formatCurrency(row.itemPrice),
                                bodyClsx: 'text-right',
                            },
                            {
                                title: 'Sub-Total',
                                format: (row) => formatCurrency(row.totalPrice),
                                bodyClsx: 'text-right',
                            },
                            {
                                title: 'Location',
                                format: (row) => row.warehouse?.name ?? 'Store',
                                headerClsx: 'w-full',
                            },
                            {
                                title: 'Actions',
                                format: (row) => {
                                    return (
                                        <Button
                                            onClick={props.onDelete(row.id)}
                                        >
                                            <FaTrash />
                                        </Button>
                                    )
                                },
                                headerClsx: 'text-right',
                                bodyClsx: 'flex justify-end',
                            },
                        ]}
                        loading={
                            AppContext.isLoading('get-purchase-order') ||
                            AppContext.isLoading('get-sales-order')
                        }
                    />
                </div>

                <div className="flex justify-end py-3 px-4">
                    <Button onClick={props.onAdd}>Add</Button>
                </div>
            </div>
        </Card>
    )
}

export default OrderProductsTable
