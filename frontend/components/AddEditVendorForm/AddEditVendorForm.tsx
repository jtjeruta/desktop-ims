import { FC, useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useAppContext } from '../../contexts/AppContext/AppContext'
import TextField from '../TextField/TextField'
import { useVendorContext } from '../../contexts/VendorContext/VendorContext'
import AddEditVendorFormSkeleton from './Skeleton'
import { CreateVendorDoc } from '../../contexts/VendorContext/types'

const vendorSchema = yup
    .object({
        name: yup.string().required(),
        phone: yup.string().required(),
        email: yup.string().email(),
        address: yup.string().required(),
    })
    .required()

type Props = {
    type?: 'create' | 'update'
}

const AddEditVendorForm: FC<Props> = (props) => {
    const methods = useForm({ resolver: yupResolver(vendorSchema) })
    const AppContext = useAppContext()
    const VendorContext = useVendorContext()

    const isDisabled =
        AppContext.isLoading('get-vendor') ||
        (props.type === 'update' && !VendorContext.selectedVendor)

    useEffect(() => {
        methods.setValue('name', VendorContext.selectedVendor?.name)
        methods.setValue('phone', VendorContext.selectedVendor?.phone)
        methods.setValue('email', VendorContext.selectedVendor?.email)
        methods.setValue('address', VendorContext.selectedVendor?.address)
    }, [VendorContext.selectedVendor, methods])

    // set on change
    useEffect(() => {
        const subscription = methods.watch(async (data) => {
            const isValid = await methods.trigger()
            VendorContext.setDraftVendor(
                isValid ? (data as CreateVendorDoc) : null
            )
        })
        return () => subscription.unsubscribe()
    }, [methods, props, VendorContext])

    return isDisabled ? (
        <AddEditVendorFormSkeleton />
    ) : (
        <FormProvider {...methods}>
            <form>
                <div className="flex flex-col gap-2">
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
                        helperText="Eg. lot 2 blok 10, San Francisco Village, lapaz, Iloilo City"
                    />
                </div>
            </form>
        </FormProvider>
    )
}

export default AddEditVendorForm
