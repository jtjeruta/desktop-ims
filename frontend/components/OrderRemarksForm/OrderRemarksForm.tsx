import { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { usePurchaseOrderContext } from '../../contexts/PurchaseOrderContext/PurchaseOrderContext'
import Card from '../Card/Card'
import TextArea from '../TextArea/TextArea'

const OrderRemarksForm = () => {
    const methods = useForm()
    const PurOrdContext = usePurchaseOrderContext()

    // set defaults
    useEffect(() => {
        const remarks = PurOrdContext.draftOrder.remarks
        if (remarks !== methods.getValues('remarks'))
            methods.setValue('remarks', remarks)
    }, [methods, PurOrdContext])

    // set on change
    useEffect(() => {
        const subscription = methods.watch((data) => {
            PurOrdContext.setDraftOrder((prev) => ({
                ...prev,
                remarks: data.remarks,
            }))
        })
        return () => subscription.unsubscribe()
    }, [methods, PurOrdContext])

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
