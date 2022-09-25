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
    onDateChange: (date: number) => void
    date: number | null
}

const OrderTotalsCard: FC<Props> = (props) => {
    const methods = useForm()

    // set defaults
    useEffect(() => {
        if (props.date && props.date !== methods.getValues('date'))
            methods.setValue(
                'date',
                moment(props.date * 1000).format('YYYY-MM-DD')
            )
    }, [methods, props.date])

    // set on change
    useEffect(() => {
        const subscription = methods.watch((data) => {
            const date = moment(data.date, 'YYYY-MM-DD').unix()
            props.onDateChange(date)
        })
        return () => subscription.unsubscribe()
    }, [methods, props])

    return (
        <Card cardClsx="w-full md:w-1/3 h-full" bodyClsx="h-full">
            <div className="flex flex-col justify-center h-full">
                <FormProvider {...methods}>
                    <form>
                        <div className="flex justify-between text-2xl mb-5">
                            <b>Order Date:</b>
                            <TextField
                                name="date"
                                type="date"
                                disableHelperText
                            />
                        </div>
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

export default OrderTotalsCard
