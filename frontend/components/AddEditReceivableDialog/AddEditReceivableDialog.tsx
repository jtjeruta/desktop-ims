import { FC, useLayoutEffect } from 'react'
import { FieldValues, FormProvider, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import moment from 'moment'
import * as yup from 'yup'
import { useAppContext } from '../../contexts/AppContext/AppContext'
import Dialog from '../Dialog/Dialog'
import TextField from '../TextField/TextField'
import { useReceivableContext } from '../../contexts/ReceivableContext/ReceivableContext'
import TextArea from '../TextArea/TextArea'

const addReceivableSchema = yup
    .object({
        name: yup.string().required(),
        description: yup.string(),
        amount: yup.number().required(),
        date: yup.date().required(),
    })
    .required()

const AddEditReceivableDialog: FC = () => {
    const AppContext = useAppContext()
    const ReceivableContext = useReceivableContext()
    const methods = useForm({ resolver: yupResolver(addReceivableSchema) })

    const onSubmit = async (data: FieldValues) => {
        const selectedId = ReceivableContext.selectedReceivable?.id

        const doc = {
            name: data.name as string,
            description: data.description as string,
            amount: data.amount as number,
            date: moment(data.date as Date).unix(),
        }

        const response = await (selectedId
            ? ReceivableContext.updateReceivable(selectedId, doc)
            : ReceivableContext.createReceivable(doc))

        if (response[0]) {
            AppContext.closeDialog()
            methods.reset()
            AppContext.addNotification({
                title: `Receivable ${selectedId ? 'updated' : 'added'}!`,
                type: 'success',
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
            AppContext.closeDialog()
            methods.reset()
            AppContext.addNotification({
                title: `Something went wrong. Please try again later.`,
                type: 'danger',
            })
        }
    }

    useLayoutEffect(() => {
        const currentDate =
            ReceivableContext.selectedReceivable?.date ?? moment().unix()
        methods.setValue('name', ReceivableContext.selectedReceivable?.name ?? '')
        methods.setValue('amount', ReceivableContext.selectedReceivable?.amount ?? 0)
        methods.setValue(
            'date',
            moment(currentDate * 1000).format('YYYY-MM-DD')
        )
        methods.setValue(
            'description',
            ReceivableContext.selectedReceivable?.description ?? ''
        )
    }, [ReceivableContext.selectedReceivable])

    return (
        <Dialog
            title={`${ReceivableContext.selectedReceivable ? 'Edit' : 'Add'} Receivable`}
            open={AppContext.dialogIsOpen('add-edit-receivable-dialog')}
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
                            <div className="flex gap-2">
                                <TextField
                                    className="grow basis-0"
                                    label="Amount"
                                    name="amount"
                                    required
                                    type="number"
                                />
                                <TextField
                                    className="grow basis-0"
                                    label="Date"
                                    name="date"
                                    required
                                    type="date"
                                />
                            </div>
                            <TextArea label="Description" name="description" />
                        </div>
                    </form>
                </FormProvider>
            }
            onSave={methods.handleSubmit(onSubmit)}
            loading={
                AppContext.isLoading('add-receivable') ||
                AppContext.isLoading('edit-receivable')
            }
        />
    )
}

export default AddEditReceivableDialog
