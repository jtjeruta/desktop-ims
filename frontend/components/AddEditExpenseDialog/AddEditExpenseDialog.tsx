import { FC, useLayoutEffect } from 'react'
import { FieldValues, FormProvider, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import moment from 'moment'
import * as yup from 'yup'
import { useAppContext } from '../../contexts/AppContext/AppContext'
import Dialog from '../Dialog/Dialog'
import TextField from '../TextField/TextField'
import { useExpenseContext } from '../../contexts/ExpenseContext/ExpenseContext'
import TextArea from '../TextArea/TextArea'

const addExpenseSchema = yup
    .object({
        name: yup.string().required(),
        description: yup.string(),
        amount: yup.number().required(),
        date: yup.date().required(),
    })
    .required()

const AddEditExpenseDialog: FC = () => {
    const AppContext = useAppContext()
    const ExpenseContext = useExpenseContext()
    const methods = useForm({ resolver: yupResolver(addExpenseSchema) })

    const onSubmit = async (data: FieldValues) => {
        const selectedId = ExpenseContext.selectedExpense?.id

        const doc = {
            name: data.name as string,
            description: data.description as string,
            amount: data.amount as number,
            date: moment(data.date as Date).unix(),
        }

        const response = await (selectedId
            ? ExpenseContext.updateExpense(selectedId, doc)
            : ExpenseContext.createExpense(doc))

        if (response[0]) {
            AppContext.closeDialog()
            methods.reset()
            AppContext.addNotification({
                title: `Expense ${selectedId ? 'updated' : 'added'}!`,
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
            ExpenseContext.selectedExpense?.date ?? moment().unix()
        methods.setValue('name', ExpenseContext.selectedExpense?.name ?? '')
        methods.setValue('amount', ExpenseContext.selectedExpense?.amount ?? 0)
        methods.setValue(
            'date',
            moment(currentDate * 1000).format('YYYY-MM-DD')
        )
        methods.setValue(
            'description',
            ExpenseContext.selectedExpense?.description ?? ''
        )
    }, [ExpenseContext.selectedExpense])

    return (
        <Dialog
            title={`${ExpenseContext.selectedExpense ? 'Edit' : 'Add'} Expense`}
            open={AppContext.dialogIsOpen('add-edit-expense-dialog')}
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
                AppContext.isLoading('add-expense') ||
                AppContext.isLoading('edit-expense')
            }
        />
    )
}

export default AddEditExpenseDialog
