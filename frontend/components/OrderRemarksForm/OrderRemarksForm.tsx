import { FC, useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import Card from '../Card/Card'
import TextArea from '../TextArea/TextArea'

type Props = {
    remarks: string | null
    onChange: (remarks: string) => void
}

const OrderRemarksForm: FC<Props> = (props) => {
    const methods = useForm()

    // set defaults
    useEffect(() => {
        if (props.remarks !== methods.getValues('remarks'))
            methods.setValue('remarks', props.remarks)
    }, [methods, props.remarks])

    // set on change
    useEffect(() => {
        const subscription = methods.watch((data) =>
            props.onChange(data.remarks)
        )
        return () => subscription.unsubscribe()
    }, [methods, props])

    return (
        <Card cardClsx="grow">
            <FormProvider {...methods}>
                <form>
                    <TextArea label="Remarks" name="remarks" />
                </form>
            </FormProvider>
        </Card>
    )
}

export default OrderRemarksForm
