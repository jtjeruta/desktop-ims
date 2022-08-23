import { FC, useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { usePurchaseOrderContext } from '../../contexts/PurchaseOrderContext/PurchaseOrderContext'
import Card from '../Card/Card'
import TextArea from '../TextArea/TextArea'

type Props = {
    draft: boolean
}

const OrderRemarksForm: FC<Props> = (props) => {
    const methods = useForm()
    const PurOrdContext = usePurchaseOrderContext()

    // set defaults
    useEffect(() => {
        const remarks = props.draft
            ? PurOrdContext.draftOrder?.remarks
            : PurOrdContext.selectedOrder?.remarks

        if (remarks !== methods.getValues('remarks'))
            methods.setValue('remarks', remarks)
    }, [methods, PurOrdContext, props.draft])

    // set on change
    useEffect(() => {
        const subscription = methods.watch((data) => {
            if (props.draft) {
                PurOrdContext.setDraftOrder((prev) => ({
                    ...prev,
                    remarks: data.remarks,
                }))
            } else {
                PurOrdContext.setSelectedOrder((prev) => {
                    if (!prev) return null
                    return {
                        ...prev,
                        remarks: data.remarks,
                    }
                })
            }
        })
        return () => subscription.unsubscribe()
    }, [methods, PurOrdContext, props.draft])

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
