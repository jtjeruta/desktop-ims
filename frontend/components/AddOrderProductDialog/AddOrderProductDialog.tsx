import { FC, useEffect } from 'react'
import { FieldValues, FormProvider, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { v4 as uuid } from 'uuid'
import { useAppContext } from '../../contexts/AppContext/AppContext'
import { usePurchaseOrderContext } from '../../contexts/PurchaseOrderContext/PurchaseOrderContext'
import { useProductContext } from '../../contexts/ProductContext/ProductContext'
import Dialog from '../Dialog/Dialog'
import TextField from '../TextField/TextField'
import Select from '../Select/Select'

const addOrderProductSchema = yup
    .object({
        product: yup.string().required(),
        quantity: yup.number().min(1).required(),
        itemPrice: yup.number().min(0).required(),
    })
    .required()

const AddOrderProductDialog: FC = () => {
    const AppContext = useAppContext()
    const ProductContext = useProductContext()
    const PurOrdContext = usePurchaseOrderContext()
    const methods = useForm({ resolver: yupResolver(addOrderProductSchema) })

    const onSubmit = async (data: FieldValues) => {
        const product = (ProductContext.products || []).find(
            (p) => p.id === data.product
        )

        if (!product) {
            return methods.setError('product', { message: 'Product not found' })
        }

        const productDoc = {
            id: uuid(),
            product,
            quantity: data.quantity,
            itemPrice: data.itemPrice,
            totalPrice: data.quantity * data.itemPrice,
        }

        PurOrdContext.setDraftOrder((prev) => ({
            ...prev,
            products: [...prev.products, productDoc],
            total: prev.total + productDoc.totalPrice,
        }))

        AppContext.closeDialog()
    }

    useEffect(() => {
        methods.setValue('quantity', 1)
        methods.setValue('itemPrice', 1)
    }, [])

    return (
        <Dialog
            title={`Add Product`}
            open={AppContext.dialogIsOpen('add-order-product-dialog')}
            content={
                <FormProvider {...methods}>
                    <form>
                        <div className="flex flex-col gap-1">
                            <Select
                                label="Product"
                                name="product"
                                required
                                options={(ProductContext.products || []).map(
                                    (product) => ({
                                        value: product.id,
                                        text: product.name,
                                    })
                                )}
                            />
                            <TextField
                                label="Quantity"
                                name="quantity"
                                min={1}
                                required
                            />
                            <TextField
                                label="Unit Price"
                                name="itemPrice"
                                type="number"
                                min={0}
                                required
                            />
                        </div>
                    </form>
                </FormProvider>
            }
            onSave={methods.handleSubmit(onSubmit)}
        />
    )
}

export default AddOrderProductDialog
