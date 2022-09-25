import { FC, useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import moment from 'moment'
import Card from '../Card/Card'
import { formatCurrency } from '../../uitls'
import Button from '../Button/Button'
import TextField from '../TextField/TextField'

type Props = {
    total: number
    disabled?: boolean
    loading?: boolean
    onSubmit: () => void
    buttonText: string
    onChange: (date: number, invoiceNumber: string) => void
    orderDate: number | null
    invoiceNumber: string | null
}

const OrderSummary: FC<Props> = (props) => {
    const methods = useForm()

    // set defaults
    useEffect(() => {
        if (props.orderDate && props.orderDate !== methods.getValues('date')) {
            methods.setValue(
                'date',
                moment(props.orderDate * 1000).format('YYYY-MM-DD')
            )
        }

        if (props.invoiceNumber != methods.getValues('invoiceNumber')) {
            methods.setValue('invoiceNumber', props.invoiceNumber)
        }
    }, [methods, props])

    // set on change
    useEffect(() => {
        const subscription = methods.watch((data) => {
            const date = moment(data.date, 'YYYY-MM-DD').unix()
            props.onChange(date, data.invoiceNumber)
        })
        return () => subscription.unsubscribe()
    }, [methods, props])

    return (
        <Card cardClsx="w-full md:w-1/3 h-full" bodyClsx="h-full">
            <div className="flex flex-col justify-center h-full">
                <FormProvider {...methods}>
                    <form>
                        <TextField name="date" label="Order Date" type="date" />
                        <TextField name="invoiceNumber" label="Invoice #" />
                    </form>
                </FormProvider>
                <div className="flex justify-between text-2xl mb-5">
                    <b>TOTAL:</b>
                    <b>{formatCurrency(props.total)}</b>
                </div>
                <Button
                    className="text-2xl w-full"
                    disabled={props.disabled}
                    loading={props.loading}
                    onClick={props.onSubmit}
                >
                    {props.buttonText}
                </Button>
            </div>
        </Card>
    )
}

export default OrderSummary
