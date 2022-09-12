import { FC, useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useAppContext } from '../../contexts/AppContext/AppContext'
import TextField from '../TextField/TextField'
import { useVendorContext } from '../../contexts/VendorContext/VendorContext'
import AddEditVendorFormSkeleton from './Skeleton'
import { AddEditVendorDoc } from '../../contexts/VendorContext/types'
import Select from '../Select/Select'

const vendorSchema = yup
    .object({
        name: yup.string().required(),
        phone: yup.string(),
        email: yup.string().email(),
        address: yup.string(),
    })
    .required()

type Props = {
    type?: 'create' | 'update'
    error?: string
    clearError?: () => void
}

const AddEditVendorFormForPurchaseOrder: FC<Props> = (props) => {
    const methods = useForm({ resolver: yupResolver(vendorSchema) })
    const AppContext = useAppContext()
    const VendorContext = useVendorContext()

    const isDisabled = AppContext.isLoading('get-purchase-order')

    useEffect(() => {
        methods.setValue('id', VendorContext.draftVendor?.id)
        methods.setValue('name', VendorContext.draftVendor?.name)
        methods.setValue('phone', VendorContext.draftVendor?.phone)
        methods.setValue('email', VendorContext.draftVendor?.email)
        methods.setValue('address', VendorContext.draftVendor?.address)
    }, [VendorContext, methods])

    // set on change
    useEffect(() => {
        const subscription = methods.watch(async (data, { name }) => {
            props.clearError && props.clearError()
            if (name === 'id') {
                // replace draft vendor with vendor data
                const foundVendor = VendorContext.vendors?.find(
                    (vendor) => vendor.id === data.id
                )

                if (!foundVendor) return
                VendorContext.setDraftVendor(foundVendor)
            } else {
                if (await methods.trigger())
                    VendorContext.setDraftVendor(data as AddEditVendorDoc)
            }
        })
        return () => subscription.unsubscribe()
    }, [methods, props, VendorContext])

    useEffect(() => {
        methods.setError('name', { message: props.error })
    }, [props, methods])

    return isDisabled ? (
        <AddEditVendorFormSkeleton />
    ) : (
        <FormProvider {...methods}>
            <form>
                <div className="flex flex-col gap-2">
                    <Select
                        label="Vendor"
                        name="id"
                        options={(VendorContext.vendors || []).map(
                            (vendor) => ({
                                value: vendor.id,
                                text: vendor.name,
                            })
                        )}
                        placeholder="New Vendor"
                        helperText="Create or Update vendor"
                    />
                    <TextField
                        label="Name"
                        name="name"
                        helperText="Eg. Vendor 1"
                    />
                    <TextField
                        label="Email"
                        name="email"
                        helperText="Eg. vendor1@gmail.com"
                    />
                    <TextField
                        label="Phone"
                        name="phone"
                        helperText="Eg. 09053454665"
                    />
                    <TextField
                        label="Address"
                        name="address"
                        helperText="Eg. shop 52, San Francisco Village, lapaz, Iloilo City"
                    />
                </div>
            </form>
        </FormProvider>
    )
}

export default AddEditVendorFormForPurchaseOrder
