import { FC, useEffect } from 'react'
import { FieldValues, FormProvider, useForm } from 'react-hook-form'
import * as yup from 'yup'

import { useAppContext } from '../../contexts/AppContext/AppContext'
import Dialog from '../Dialog/Dialog'
import TextField from '../TextField/TextField'
import { yupResolver } from '@hookform/resolvers/yup'
import { useProductContext } from '../../contexts/ProductContext/ProductContext'
import Select from '../Select/Select'

const transferStockSchema = yup
    .object({
        transferFrom: yup.string().required(),
        transferTo: yup.string().required(),
        amount: yup
            .number()
            .required()
            .min(0, 'Must be 0 or greater')
            .integer(),
    })
    .required()

const TransferStockDialog: FC = () => {
    const AppContext = useAppContext()
    const ProductContext = useProductContext()
    const methods = useForm({ resolver: yupResolver(transferStockSchema) })

    let options = (ProductContext.product?.warehouses || []).map(
        (warehouse) => ({
            text: warehouse.name,
            value: warehouse.id,
        })
    )

    options = [...options, { text: 'Store', value: 'store' }]

    useEffect(() => {
        methods.setValue('transferFrom', ProductContext.selectedWarehouse?.id)
        methods.setValue('transferTo', 'store')
        methods.setValue('amount', 1)
    }, [methods, ProductContext])

    const onSubmit = async (data: FieldValues) => {
        if (!ProductContext.product) return

        const doc = {
            transferTo: data.transferTo,
            transferFrom: data.transferFrom,
            amount: +data.amount,
        }

        const response = await ProductContext.transferStock(
            ProductContext.product.id,
            doc
        )

        if (response[0]) {
            AppContext.closeDialog()
            methods.reset()
            AppContext.addNotification({
                title: 'Stock transfered!',
            })
        } else if (response[1].errors) {
            const { errors } = response[1]

            ;(Object.keys(errors) as Array<keyof typeof errors>).map((key) => {
                methods.setError(key, {
                    type: 'custom',
                    message: errors[key]?.message,
                })
            })
        } else if (response[1].message) {
            methods.setError('amount', {
                type: 'custom',
                message: response[1].message,
            })
        }
    }

    return (
        <Dialog
            title="Transfer Stock"
            open={AppContext.dialogIsOpen('transfer-stock-dialog')}
            content={
                <FormProvider {...methods}>
                    <form>
                        <div className="flex flex-col gap-2">
                            <Select
                                label="Transfer from"
                                name="transferFrom"
                                required
                                options={options}
                            />
                            <Select
                                label="Transfer to"
                                name="transferTo"
                                required
                                options={options}
                            />
                            <TextField
                                label="Amount"
                                name="amount"
                                type="number"
                                min={0}
                                required
                            />
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
