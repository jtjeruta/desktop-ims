// import { FaTrash } from 'react-icons/fa'
import Button from '../Button/Button'
// import Table from '../Table/Table'
import Card from '../Card/Card'
import { useProductContext } from '../../contexts/ProductContext/ProductContext'

const ManageProductVariants = () => {
    const ProductContext = useProductContext()

    return (
        <div className="flex">
            <Card cardClsx="w-full" bodyClsx="!px-0 !py-0 h-full">
                <div className="flex flex-col h-full">
                    <div className="grow">
                        {/* <Table
                            rows={ProductContext.product?.variants || []}
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
                                    headerClsx: 'text-right',
                                    bodyClsx: 'flex justify-end',
                                },
                            ]}
                        /> */}
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
