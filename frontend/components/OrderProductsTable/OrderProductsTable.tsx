import { FC } from 'react'
import { FaTrash } from 'react-icons/fa'
import { useAppContext } from '../../contexts/AppContext/AppContext'
import { Product, Warehouse } from '../../contexts/ProductContext/types'
import { formatCurrency } from '../../uitls'
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

    return (
        <Card cardClsx="grow" bodyClsx="!px-0 !py-0 h-full">
            <div className="flex flex-col h-full">
                <div className="grow overflow-x-auto">
                    <Table
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
                                title: 'Remove From',
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
                        loading={AppContext.isLoading('get-purchase-order')}
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
