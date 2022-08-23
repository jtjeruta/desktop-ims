import { FC, useCallback, useEffect } from 'react'
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

type Props = {
    draft: boolean
}

const AddOrderProductDialog: FC<Props> = (props) => {
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

        const warehouse = product.warehouses.find(
            (warehouse) => warehouse.id === data.warehouse
        )

        const productDoc = {
            id: uuid(),
            product,
            quantity: data.quantity,
            itemPrice: data.itemPrice,
            totalPrice: data.quantity * data.itemPrice,
            warehouse,
        }

        if (props.draft) {
            PurOrdContext.setDraftOrder((prev) => ({
                ...prev,
                products: [...prev.products, productDoc],
                total: prev.total + productDoc.totalPrice,
            }))
        } else {
            PurOrdContext.setSelectedOrder((prev) => {
                if (!prev) return null

                return {
                    ...prev,
                    products: [...prev.products, productDoc],
                    total: prev.total + productDoc.totalPrice,
                }
            })
        }

        AppContext.closeDialog()
    }

    const setSelectedProduct = useCallback(
        (id: string) => {
            const foundProduct = ProductContext.products?.find(
                (product) => product.id === id
            )
            ProductContext.setProduct(foundProduct || null)
        },
        [ProductContext]
    )

    // set defaults
    useEffect(() => {
        if (
            !ProductContext.product &&
            (ProductContext.products || []).length > 0
        ) {
            const defaultProduct = ProductContext.products?.[0]?.id
            setSelectedProduct(defaultProduct || '')
        }

        methods.setValue('quantity', 1)
        methods.setValue('itemPrice', 1)
    }, [methods, ProductContext, setSelectedProduct])

    // set on change
    useEffect(() => {
        const subscription = methods.watch((data, { name }) => {
            if (name === 'product') {
                setSelectedProduct(data.product)
            }
        })
        return () => subscription.unsubscribe()
    }, [methods, setSelectedProduct])

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
                            <Select
                                label="Transfer To"
                                name="warehouse"
                                required
                                options={[
                                    {
                                        value: 'store',
                                        text: 'Store',
                                    },
                                    ...(
                                        ProductContext.product?.warehouses || []
                                    ).map((warehouse) => ({
                                        value: warehouse.id,
                                        text: warehouse.name,
                                    })),
                                ]}
                            />
                            <div className="flex gap-3">
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
                        </div>
                    </form>
                </FormProvider>
            }
            onSave={methods.handleSubmit(onSubmit)}
        />
    )
}

export default AddOrderProductDialog
