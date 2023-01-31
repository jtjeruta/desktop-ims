import { FC, useEffect } from 'react'
import { FieldValues, FormProvider, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

import { useAppContext } from '../../contexts/AppContext/AppContext'
import TextField from '../TextField/TextField'
import Button from '../Button/Button'
import { useVendorContext } from '../../contexts/VendorContext/VendorContext'
import TextArea from '../TextArea/TextArea'

const vendorSchema = yup
    .object({
        name: yup.string().required(),
        phone: yup.string(),
        email: yup.string().email(),
        address: yup.string(),
        remarks: yup.string(),
    })
    .required()

const AddEditVendorForm: FC = () => {
    const methods = useForm({ resolver: yupResolver(vendorSchema) })
    const AppContext = useAppContext()
    const VendorContext = useVendorContext()

    const onSubmit = async (values: FieldValues) => {
        const doc = {
            name: values.name as string,
            phone: values.phone as string,
            email: values.email as string,
            address: values.address as string,
            remarks: values.remarks as string,
        }

        const response = await (VendorContext.selectedVendor
            ? VendorContext.updateVendor(VendorContext.selectedVendor.id, doc)
            : VendorContext.createVendor(doc))

        if (response[0]) {
            AppContext.closeDialog()
            methods.reset()
            AppContext.addNotification({
                title: !VendorContext.selectedVendor
                    ? 'Vendor added!'
                    : 'Vendor updated!',
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
            methods.setError('name', {
                type: 'custom',
                message: 'Name already taken',
            })
        }
    }

    useEffect(() => {
        methods.setValue('name', VendorContext.selectedVendor?.name)
        methods.setValue('phone', VendorContext.selectedVendor?.phone)
        methods.setValue('email', VendorContext.selectedVendor?.email)
        methods.setValue('address', VendorContext.selectedVendor?.address)
        methods.setValue('remarks', VendorContext.selectedVendor?.remarks)
    }, [VendorContext.selectedVendor, methods])

    return (
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-2">
                    <TextField
                        name="name"
                        label="Name"
                        helperText="Eg. Vendor 1"
                    />
                    <TextField
                        name="email"
                        label="Email"
                        helperText="Eg. vendor1@gmail.com"
                    />
                    <TextField
                        name="phone"
                        label="Phone"
                        helperText="Eg. 0906432123"
                    />
                    <TextField
                        name="address"
                        label="Address"
                        helperText="Eg. shop 52, San Francisco Village, lapaz, Iloilo City"
                    />
                    <TextArea name="remarks" label="Remarks" />
                    <div className="flex justify-end">
                        <Button
                            loading={
                                AppContext.isLoading('update-vendor') ||
                                AppContext.isLoading('add-vendor')
                            }
                        >
                            Submit
                        </Button>
                    </div>
                </div>
            </form>
        </FormProvider>
    )
}

export default AddEditVendorForm
