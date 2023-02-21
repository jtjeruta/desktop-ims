import { FC, useCallback, useLayoutEffect } from 'react'
import { FieldValues, FormProvider, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { v4 as uuid } from 'uuid'
import { useAppContext } from '../../contexts/AppContext/AppContext'
import { useSalesOrderContext } from '../../contexts/SalesOrderContext/SalesOrderContext'
import { useProductContext } from '../../contexts/ProductContext/ProductContext'
import Dialog from '../Dialog/Dialog'
import TextField from '../TextField/TextField'
import Select from '../Select/Select'
import { usePurchaseOrderContext } from '../../contexts/PurchaseOrderContext/PurchaseOrderContext'
import {
    customerCanBuyProduct,
    getProductWarehouses,
    updateProductOrWarehouseQuantity,
} from '../../utils/product-utils'
import { useWarehouseContext } from '../../contexts/WarehouseContext/WarehouseContext'
import SelectPicker from '../Select/SelectPicker'

const addOrderProductSchema = yup
    .object({
        product: yup.string().required(),
        quantity: yup.number().min(1).required(),
        itemPrice: yup.number().min(0).required(),
    })
    .required()

type Props = {
    type: 'purchase' | 'sales'
}

const AddOrderProductDialog: FC<Props> = (props) => {
    const AppContext = useAppContext()
    const ProductContext = useProductContext()
    const PurOrdContext = usePurchaseOrderContext()
    const SalesOrderContext = useSalesOrderContext()
    const WarehouseContext = useWarehouseContext()
    const methods = useForm({ resolver: yupResolver(addOrderProductSchema) })
    const productWarehouses =
        props.type === 'sales'
            ? getProductWarehouses(
                  WarehouseContext.warehouses,
                  ProductContext.product
              )
            : WarehouseContext.warehouses?.map((warehouse) => ({
                  id: warehouse.id,
                  name: warehouse.name,
              })) ?? []

    const onSubmit = async (data: FieldValues) => {
        const product = (ProductContext.products || []).find(
            (p) => p.id === data.product
        )

        if (!product) {
            return methods.setError('product', { message: 'Product not found' })
        }

        const warehouse = WarehouseContext.warehouses?.find(
            (warehouse) => warehouse.id === data.warehouse
        )

        const variant = product.variants.find(
            (variant) => variant.id === data.variant
        )

        if (!variant) {
            return methods.setError('variant', {
                message: 'Unit not found',
            })
        }

        const productDoc = {
            id: uuid(),
            product,
            quantity: data.quantity,
            itemPrice: data.itemPrice,
            totalPrice: data.quantity * variant.quantity * data.itemPrice,
            warehouse: warehouse ?? null,
            variant,
        }

        if (props.type === 'purchase') {
            PurOrdContext.setDraftOrder((prev) => ({
                ...prev,
                products: [...prev.products, productDoc],
                total: prev.total + productDoc.totalPrice,
            }))
        } else if (props.type === 'sales') {
            const { valid, remainingQuantity } = customerCanBuyProduct(
                ProductContext.products ?? [],
                WarehouseContext.warehouses ?? [],
                product.id,
                variant.id,
                warehouse?.id ?? '',
                data.quantity
            )

            if (!valid) {
                return methods.setError('quantity', {
                    type: 'manual',
                    message: 'No stock available',
                })
            } else {
                methods.clearErrors('quantity')
            }

            updateProductOrWarehouseQuantity(
                WarehouseContext,
                product.id,
                warehouse?.id,
                remainingQuantity
            )

            SalesOrderContext.setDraftOrder((prev) => ({
                ...prev,
                products: [...prev.products, productDoc],
                total: prev.total + productDoc.totalPrice,
            }))
        }

        AppContext.closeDialog()
    }

    const setSelectedProduct = useCallback(
        (id: string) => {
            const foundProduct = ProductContext.products?.find(
                (product) => product.id === id
            )
            methods.setValue('warehouse', 'store')
            methods.setValue('variant', foundProduct?.variants[0].id)
            methods.clearErrors('product')
            ProductContext.setProduct(foundProduct || null)
        },
        [ProductContext]
    )

    const productOptions = (ProductContext.products || [])
        .filter((product) => props.type === 'purchase' || product.published)
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((product) => ({
            label: product.name,
            value: product.id,
        }))

    // set on change
    useLayoutEffect(() => {
        const subscription = methods.watch((data, { name }) => {
            if (name === 'product') {
                setSelectedProduct(data.product)
            }

            if (
                ['quantity', 'product', 'warehouse', 'variant'].includes(
                    name || ''
                ) &&
                props.type === 'sales'
            ) {
                const { valid } = customerCanBuyProduct(
                    ProductContext.products || [],
                    WarehouseContext.warehouses ?? [],
                    data.product,
                    data.variant,
                    data.warehouse,
                    data.quantity ?? 1
                )

                if (!valid) {
                    methods.setError('quantity', {
                        type: 'manual',
                        message: 'No stock available',
                    })
                } else {
                    methods.clearErrors('quantity')
                }
            }
        })
        return () => subscription.unsubscribe()
    }, [methods, setSelectedProduct, ProductContext.products, props.type])

    // set defaults
    useLayoutEffect(() => {
        if (
            !ProductContext.product &&
            (ProductContext.products || []).length > 0
        ) {
            const defaultProduct = ProductContext.products?.[0]?.id
            methods.setValue('product', defaultProduct)
        }

        methods.setValue('quantity', 1)
        methods.setValue('warehouse', 'store')
        methods.setValue(
            'itemPrice',
            (props.type === 'purchase'
                ? ProductContext.product?.costPrice
                : ProductContext.product?.sellingPrice) ?? 1
        )
    }, [methods, ProductContext])

    return (
        <Dialog
            title={`Add Product`}
            open={AppContext.dialogIsOpen('add-order-product-dialog')}
            content={
                <FormProvider {...methods}>
                    <form>
                        <div className="flex flex-col gap-1">
                            {AppContext.dialogIsOpen(
                                'add-order-product-dialog'
                            ) && (
                                <SelectPicker
                                    label="Product"
                                    name="product"
                                    required
                                    options={productOptions}
                                    defaultValue={
                                        ProductContext.product
                                            ? {
                                                  label: ProductContext.product
                                                      .name,
                                                  value: ProductContext.product
                                                      .id,
                                              }
                                            : undefined
                                    }
                                    onChange={(product) =>
                                        methods.setValue(
                                            'product',
                                            product?.value
                                        )
                                    }
                                    error={
                                        methods.formState.errors.product
                                            ?.message
                                    }
                                    autoFocus
                                />
                            )}
                            <div className="flex gap-3">
                                <span className="grow basis-0">
                                    <Select
                                        label="Unit"
                                        name="variant"
                                        required
                                        options={[
                                            ...(
                                                ProductContext.product
                                                    ?.variants || []
                                            ).map((variant) => ({
                                                value: variant.id,
                                                text: `${variant.name} (${variant.quantity})`,
                                            })),
                                        ]}
                                        className="grow"
                                    />
                                </span>
                                <span className="grow basis-0">
                                    <TextField
                                        label="Quantity"
                                        name="quantity"
                                        type="number"
                                        min={1}
                                        required
                                    />
                                </span>
                            </div>
                            <div className="flex gap-3">
                                <SelectPicker
                                    label={
                                        props.type === 'sales'
                                            ? 'Remove From'
                                            : 'Add To'
                                    }
                                    name="warehouse"
                                    required
                                    options={[
                                        {
                                            value: 'store',
                                            label: 'Store',
                                        },
                                        ...productWarehouses.map(
                                            (warehouse) => ({
                                                value: warehouse.id,
                                                label: warehouse.name,
                                            })
                                        ),
                                    ]}
                                    defaultValue={{
                                        label: 'Store',
                                        value: 'store',
                                    }}
                                    onChange={(warehouse) =>
                                        methods.setValue(
                                            'warehouse',
                                            warehouse?.value
                                        )
                                    }
                                    error={
                                        methods.formState.errors.warehouse
                                            ?.message
                                    }
                                    className="grow basis-0"
                                />
                                <TextField
                                    label={
                                        props.type === 'sales'
                                            ? 'Selling Price'
                                            : 'Unit Price'
                                    }
                                    name="itemPrice"
                                    type="number"
                                    min={0}
                                    className="grow basis-0"
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
