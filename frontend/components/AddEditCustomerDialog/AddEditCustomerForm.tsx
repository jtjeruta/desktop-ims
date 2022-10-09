import { FC, useEffect } from 'react'
import { FieldValues, FormProvider, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

import { useAppContext } from '../../contexts/AppContext/AppContext'
import TextField from '../TextField/TextField'
import Button from '../Button/Button'
import { useCustomerContext } from '../../contexts/CustomerContext/CustomerContext'

const customerSchema = yup
    .object({
        name: yup.string().required(),
        phone: yup.string(),
        email: yup.string().email(),
        address: yup.string(),
    })
    .required()

const AddEditCustomerForm: FC = () => {
    const methods = useForm({ resolver: yupResolver(customerSchema) })
    const AppContext = useAppContext()
    const CustomerContext = useCustomerContext()

    const onSubmit = async (values: FieldValues) => {
        const doc = {
            name: values.name as string,
            phone: values.phone as string,
            email: values.email as string,
            address: values.address as string,
        }

        const response = await (CustomerContext.selectedCustomer
            ? CustomerContext.updateCustomer(
                  CustomerContext.selectedCustomer.id,
                  doc
              )
            : CustomerContext.createCustomer(doc))

        if (response[0]) {
            AppContext.closeDialog()
            methods.reset()
            AppContext.addNotification({
                title: !CustomerContext.selectedCustomer
                    ? 'Customer added!'
                    : 'Customer updated!',
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
        methods.setValue('name', CustomerContext.selectedCustomer?.name)
        methods.setValue('phone', CustomerContext.selectedCustomer?.phone)
        methods.setValue('email', CustomerContext.selectedCustomer?.email)
        methods.setValue('address', CustomerContext.selectedCustomer?.address)
    }, [CustomerContext.selectedCustomer, methods])

    return (
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-2">
                    <TextField
                        name="name"
                        label="Name"
                        helperText="Eg. Customer 1"
                    />
                    <TextField
                        name="email"
                        label="Email"
                        helperText="Eg. customer1@gmail.com"
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
                    <div className="flex justify-end">
                        <Button
                            loading={
                                AppContext.isLoading('update-customer') ||
                                AppContext.isLoading('add-customer')
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

export default AddEditCustomerForm
