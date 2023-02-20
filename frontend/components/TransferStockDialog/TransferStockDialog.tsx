import { FC, useLayoutEffect } from 'react'
import { FieldValues, FormProvider, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { HiSwitchHorizontal } from 'react-icons/hi'

import { useAppContext } from '../../contexts/AppContext/AppContext'
import Dialog from '../Dialog/Dialog'
import TextField from '../TextField/TextField'
import { yupResolver } from '@hookform/resolvers/yup'
import { useProductContext } from '../../contexts/ProductContext/ProductContext'
import Select from '../Select/Select'
import { useWarehouseContext } from '../../contexts/WarehouseContext/WarehouseContext'
import Button from '../Button/Button'

const transferStockSchema = yup
    .object({
        transferFrom: yup.string().required(),
        transferTo: yup.string().required(),
        amount: yup
            .number()
            .required()
            .integer()
            .min(0, 'Must be 0 or greater'),
        units: yup.number().integer().min(0, 'Must be 0 or greater'),
    })
    .required()

type Props = {
    showProductSelect?: boolean
}

const TransferStockDialog: FC<Props> = (props) => {
    const AppContext = useAppContext()
    const ProductContext = useProductContext()
    const WarehouseContext = useWarehouseContext()
    const methods = useForm({ resolver: yupResolver(transferStockSchema) })

    let warehouses = (WarehouseContext.warehouses || []).map((warehouse) => ({
        text: warehouse.name,
        value: warehouse.id,
    }))

    warehouses = [...warehouses, { text: 'Store', value: 'store' }]

    let transferOptions =
        ProductContext.product?.variants.map((variant) => ({
            value: variant.quantity,
            text: variant.name,
        })) || []

    if (!transferOptions.some((option) => option.value === 1)) {
        transferOptions = [{ text: ' ', value: 1 }, ...transferOptions]
    }

    useLayoutEffect(() => {
        const subscription = methods.watch((data, { name }) => {
            if (name !== 'product') return
            const foundProduct = ProductContext.products?.find(
                (p) => p.id === data[name]
            )
            ProductContext.setProduct(foundProduct ?? null)
        })
        return () => subscription.unsubscribe()
    }, [ProductContext.products])

    useLayoutEffect(() => {
        methods.setValue('transferFrom', WarehouseContext.selectedWarehouse?.id)
        methods.setValue('transferTo', 'store')
        methods.setValue('amount', 1)
        methods.setValue('units', transferOptions[0].value)

        if (
            !ProductContext.product &&
            (ProductContext.products?.length ?? 0) > 0
        ) {
            methods.setValue('product', ProductContext.products?.[0].id)
        }
    }, [
        ProductContext.product,
        WarehouseContext.selectedWarehouse,
        ProductContext.products,
    ])

    const onSubmit = async (data: FieldValues) => {
        if (!ProductContext.product) return

        const doc = {
            transferTo: data.transferTo,
            transferFrom: data.transferFrom,
            amount: +data.amount * +data.units,
        }

        const response = await ProductContext.transferStock(
            ProductContext.product.id,
            doc
        )

        if (response[0]) {
            AppContext.closeDialog()
            methods.reset()
            AppContext.addNotification({
                title: 'Stock transferred!',
                type: 'success',
            })
            WarehouseContext.setWarehouses(null)
            WarehouseContext.listWarehouses()
        } else if (response[1].message) {
            methods.setError('amount', {
                type: 'custom',
                message: response[1].message,
            })
        } else if (response[1]) {
            const { errors } = response[1]
            ;(Object.keys(errors) as Array<keyof typeof errors>).map((key) => {
                methods.setError(key as string, {
                    type: 'custom',
                    message: errors[key]?.message,
                })
            })
        }
    }

    const switchTransferFromAndTo = () => {
        const transferFrom = methods.getValues('transferFrom')
        const transferTo = methods.getValues('transferTo')
        methods.setValue('transferFrom', transferTo)
        methods.setValue('transferTo', transferFrom)
    }

    return (
        <Dialog
            title="Transfer Stock"
            open={AppContext.dialogIsOpen('transfer-stock-dialog')}
            content={
                <FormProvider {...methods}>
                    <form>
                        <div className="flex flex-col gap-2">
                            {props.showProductSelect && (
                                <Select
                                    label="Product"
                                    name="product"
                                    options={
                                        ProductContext.products?.map(
                                            (product) => ({
                                                text: product.name,
                                                value: product.id,
                                            })
                                        ) ?? []
                                    }
                                    required
                                />
                            )}
                            <div className="flex gap-2">
                                <Select
                                    label="Transfer from"
                                    name="transferFrom"
                                    required
                                    options={warehouses}
                                    className="grow"
                                />
                                <div className="flex items-center">
                                    <Button
                                        type="button"
                                        style="outline"
                                        color="secondary"
                                        onClick={switchTransferFromAndTo}
                                    >
                                        <HiSwitchHorizontal />
                                    </Button>
                                </div>
                                <Select
                                    label="Transfer to"
                                    name="transferTo"
                                    required
                                    options={warehouses}
                                    className="grow"
                                />
                            </div>
                            <div className="flex gap-2">
                                <TextField
                                    label="Quantity"
                                    name="amount"
                                    type="number"
                                    min={0}
                                    className="basis-0 grow"
                                    required
                                />
                                <Select
                                    label="Unit"
                                    name="units"
                                    options={transferOptions}
                                    className="basis-0 grow"
                                    required
                                />
                            </div>
                        </div>
                    </form>
                </FormProvider>
            }
            onSave={methods.handleSubmit(onSubmit)}
            loading={AppContext.isLoading('transfer-stock')}
        />
    )
}

export default TransferStockDialog
