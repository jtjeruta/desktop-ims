import { FC } from 'react'
import { FaTrash } from 'react-icons/fa'
import { Product } from '../../pages/inventory'
import Button from '../Button/Button'
import Table from '../Table/Table'
import Card from '../Card/Card'

const ManageProductVariants: FC<{ product: Product }> = (props) => {
    return (
        <div className="flex basis-0 grow">
            <Card className="w-full" bodyProps={{ className: 'p-0 h-full' }}>
                <div className="flex flex-col h-full">
                    <div className="grow">
                        <Table
                            rows={props.product.variants || []}
                            columns={[
                                {
                                    title: 'Unit',
                                    key: 'name',
                                },
                                {
                                    title: 'Qty',
                                    key: 'quantity',
                                },
                                {
                                    title: 'Actions',
                                    format: () => {
                                        return (
                                            <Button>
                                                <FaTrash />
                                            </Button>
                                        )
                                    },
                                    className: 'w-min',
                                },
                            ]}
                        />
                    </div>
                    <div className="flex justify-end p-4">
                        <Button>Add</Button>
                    </div>
                </div>
            </Card>
        </div>
    )
}

export default ManageProductVariants
