import { FC } from 'react'
import { FaTrash } from 'react-icons/fa'
import { Product } from '../../contexts/ProductContext/types'
import Button from '../Button/Button'
import Card from '../Card/Card'
import Table from '../Table/Table'

type Props = {
    onAdd: () => void
    onDelete: (name: string) => () => void
    products: {
        id: string
        product: Product
        quantity: number
        itemPrice: number
        totalPrice: number
    }[]
}

const OrderProductsTable: FC<Props> = (props) => {
    return (
        <Card cardClsx="grow" bodyClsx="!px-0 !py-0 h-full">
            <div className="flex flex-col h-full">
                <div className="grow">
                    <Table
                        rows={props.products || []}
                        columns={[
                            {
                                title: 'Product',
                                format: (row) => row.product.name,
                                headerClsx: 'w-full',
                            },
                            {
                                title: 'QTY',
                                format: (row) => row.quantity,
                                bodyClsx: 'text-right',
                            },
                            {
                                title: 'Unit Price',
                                format: (row) => row.itemPrice,
                                bodyClsx: 'text-right',
                            },
                            {
                                title: 'Sub-Total',
                                format: (row) => row.totalPrice,
                                bodyClsx: 'text-right',
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
