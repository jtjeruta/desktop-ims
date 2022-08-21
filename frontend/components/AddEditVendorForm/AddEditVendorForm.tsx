import { FC, useEffect } from 'react'
import { FieldValues, FormProvider, useForm } from 'react-hook-form'
import { useRouter } from 'next/router'
import clsx from 'clsx'

import { useAppContext } from '../../contexts/AppContext/AppContext'
import TextField from '../TextField/TextField'
import Button from '../Button/Button'
import { useVendorContext } from '../../contexts/VendorContext/VendorContext'
import AddEditVendorFormSkeleton from './Skeleton'

type Props = {
    type?: 'create' | 'update'
}

const AddEditVendorForm: FC<Props> = (props) => {
    const methods = useForm()
    const AppContext = useAppContext()
    const VendorContext = useVendorContext()
    const router = useRouter()

    const isDisabled =
        AppContext.isLoading('get-vendor') ||
        (props.type === 'update' && !VendorContext.selectedVendor)

    const onSubmit = async (values: FieldValues) => {
        console.log('submit')
        // if (isDisabled) return null

        // const doc = {
        //     name: values.name as string,
        //     brand: values.brand as string,
        //     category: values.category as string,
        //     subCategory: values.subCategory as string,
        //     price: +values.price,
        //     storeQty: +values.storeQty,
        // }

        // const response = await (VendorContext.selectedVendor
        //     ? VendorContext.updateVendor(VendorContext.selectedVendor.id, doc)
        //     : VendorContext.createVendor(doc))

        // if (response[0]) {
        //     AppContext.closeDialog()
        //     methods.reset()
        //     AppContext.addNotification({
        //         title: !VendorContext.selectedVendor
        //             ? 'Vendor added!'
        //             : 'Vendor updated!',
        //     })
        //     !VendorContext.selectedVendor &&
        //         router.push(`/inventory/${response[1].id}`)
        // } else if (response[1].errors) {
        //     const { errors } = response[1]

        //     ;(Object.keys(errors) as Array<keyof typeof errors>).map((key) => {
        //         methods.setError(key, {
        //             type: 'custom',
        //             message: errors[key]?.message,
        //         })
        //     })
        // } else if (response[1].message) {
        //     methods.setError('name', {
        //         type: 'custom',
        //         message: 'Name already taken',
        //     })
        // }
    }

    useEffect(() => {
        methods.setValue('name', VendorContext.selectedVendor?.name)
        methods.setValue('phone', VendorContext.selectedVendor?.phone)
        methods.setValue('email', VendorContext.selectedVendor?.email)
        methods.setValue('address', VendorContext.selectedVendor?.address)
    }, [VendorContext.selectedVendor, methods])

    return isDisabled ? (
        <AddEditVendorFormSkeleton />
    ) : (
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
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
                    {/* <div className="flex justify-end mt-3">
                        <Button
                            loading={
                                AppContext.isLoading('update-vendor') ||
                                AppContext.isLoading('add-vendor')
                            }
                        >
                            Submit
                        </Button>
                    </div> */}
                </div>
            </form>
        </FormProvider>
    )
}

export default AddEditVendorForm
