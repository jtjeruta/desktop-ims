import { FC, useEffect } from 'react'
import { FieldValues, FormProvider, useForm } from 'react-hook-form'
import { useAppContext } from '../../contexts/AppContext/AppContext'
import Dialog from '../Dialog/Dialog'
import TextField from '../TextField/TextField'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useWarehouseContext } from '../../contexts/WarehouseContext/WarehouseContext'

const addWarehouseSchema = yup
    .object({ name: yup.string().required() })
    .required()

const AddEditWarehouseDialog: FC = () => {
    const AppContext = useAppContext()
    const WarehouseContext = useWarehouseContext()
    const methods = useForm({ resolver: yupResolver(addWarehouseSchema) })

    const onSubmit = async (data: FieldValues) => {
        const selectedId = WarehouseContext.selectedWarehouse?.id

        const doc = {
            name: data.name as string,
            products: [],
        }

        const response = await (selectedId
            ? WarehouseContext.updateWarehouse(selectedId, doc)
            : WarehouseContext.createWarehouse(doc))

        if (response[0]) {
            AppContext.closeDialog()
            methods.reset()
            AppContext.addNotification({
                title: `Warehouse ${selectedId ? 'updated' : 'added'}!`,
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

    useEffect(() => {
        methods.setValue(
            'name',
            WarehouseContext.selectedWarehouse?.name ?? null
        )
    }, [WarehouseContext.selectedWarehouse])

    return (
        <Dialog
            title={`${
                WarehouseContext.selectedWarehouse ? 'Edit' : 'Add'
            } Warehouse`}
            open={AppContext.dialogIsOpen('add-edit-warehouse-dialog')}
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
                        </div>
                    </form>
                </FormProvider>
            }
            onSave={methods.handleSubmit(onSubmit)}
            loading={
                AppContext.isLoading('add-warehouse') ||
                AppContext.isLoading('edit-warehouse')
            }
        />
    )
}

export default AddEditWarehouseDialog
