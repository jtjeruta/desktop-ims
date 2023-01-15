import { FaTrash } from 'react-icons/fa'
import { useProductContext } from '../../contexts/ProductContext/ProductContext'
import Button from '../Button/Button'
import Table from '../Table/Table'
import Card from '../Card/Card'
import { useAppContext } from '../../contexts/AppContext/AppContext'
import AddVariantDialog from '../AddVariantDialog/AddVariantDialog'
import ConfirmDialog from '../ConfirmDialog/ConfirmDialog'
import { Variant } from '../../contexts/ProductContext/types'

const ManageProductVariants = () => {
    const AppContext = useAppContext()
    const ProductContext = useProductContext()

    const variantCanBeDeleted =
        (ProductContext.product?.variants || []).length > 1

    return (
        <>
            <div className="flex grow basis-0">
                <Card cardClsx="w-full" bodyClsx="!px-0 !py-0 h-full">
                    <div className="flex flex-col h-full">
                        <div className="grow">
                            <Table
                                loading={!ProductContext.product}
                                rows={ProductContext.product?.variants || []}
                                columns={[
                                    {
                                        title: 'Unit',
                                        key: 'name',
                                        sort: (variant) => variant.name,
                                    },
                                    {
                                        title: 'Qty',
                                        key: 'quantity',
                                        bodyClsx: 'text-center',
                                        sort: (variant) => variant.quantity,
                                    },
                                    {
                                        title: 'Actions',
                                        format: (row) => {
                                            const variant = row as Variant
                                            return (
                                                <Button
                                                    onClick={() => {
                                                        ProductContext.setVariantToDelete(
                                                            variant
                                                        )
                                                        AppContext.openDialog(
                                                            'delete-variant-dialog'
                                                        )
                                                    }}
                                                    disabled={
                                                        !variantCanBeDeleted
                                                    }
                                                    disabledText={
                                                        'Product must contain at least one variant.'
                                                    }
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
                        <div className="flex justify-end p-4">
                            <Button
                                disabled={!ProductContext.product}
                                onClick={() => {
                                    AppContext.openDialog('add-variant-dialog')
                                }}
                            >
                                Add
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>
            <AddVariantDialog />
            <ConfirmDialog
                text={`Delete variant ${ProductContext.variantToDelete?.name}?`}
                dialogKey="delete-variant-dialog"
                onConfirm={async () => {
                    if (ProductContext.variantToDelete) {
                        await ProductContext.deleteVariant(
                            ProductContext.variantToDelete?.id
                        )
                        AppContext.closeDialog()
                    }
                }}
                loading={AppContext.isLoading('delete-variant')}
            />
        </>
    )
}

export default ManageProductVariants
