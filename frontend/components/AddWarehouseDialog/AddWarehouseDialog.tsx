import { FC } from 'react'
import { FieldValues, FormProvider, useForm } from 'react-hook-form'
import { useAppContext } from '../../contexts/AppContext/AppContext'
import Dialog from '../Dialog/Dialog'
import TextField from '../TextField/TextField'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useProductContext } from '../../contexts/ProductContext/ProductContext'

const addWarehouseSchema = yup
    .object({
        name: yup.string().required(),
        quantity: yup
            .number()
            .required()
            .min(0, 'Must be 0 or greater')
            .integer(),
    })
    .required()

const AddWarehouseDialog: FC = () => {
    const AppContext = useAppContext()
    const ProductContext = useProductContext()
    const methods = useForm({ resolver: yupResolver(addWarehouseSchema) })

    const onSubmit = async (data: FieldValues) => {
        if (!ProductContext.product) return

        const doc = {
            name: data.name,
            quantity: data.quantity,
        }

        const response = await ProductContext.createWarehouse(
            ProductContext.product.id,
            doc
        )

        if (response[0]) {
            AppContext.closeDialog()
            methods.reset()
            AppContext.addNotification({
                title: 'Warehouse added!',
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
            methods.setError('name', {
                type: 'custom',
                message: 'Name already taken',
            })
        }
    }

    return (
        <Dialog
            title="Add Warehouse"
            open={AppContext.dialogIsOpen('add-warehouse-dialog')}
            content={
                <FormProvider {...methods}>
                    <form>
                        <div className="flex flex-col gap-2">
                            <TextField
                                label="Name"
                                name="name"
                                required
                                autoFocus
                            />
                            <TextField
                                label="Quantity"
                                name="quantity"
                                type="number"
                                min={0}
                                required
                            />
                        </div>
                    </form>
                </FormProvider>
            }
            onSave={methods.handleSubmit(onSubmit)}
            loading={AppContext.isLoading('add-warehouse')}
        />
    )
}

export default AddWarehouseDialog
