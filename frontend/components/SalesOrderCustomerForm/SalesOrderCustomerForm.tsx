import { FC, useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useAppContext } from '../../contexts/AppContext/AppContext'
import TextField from '../TextField/TextField'
import { useCustomerContext } from '../../contexts/CustomerContext/CustomerContext'
import { AddEditCustomerDoc } from '../../contexts/CustomerContext/types'
import Select from '../Select/Select'
import SalesOrderCustomerFormSkeleton from './Skeleton'

const customerSchema = yup
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

const SalesOrderCustomerForm: FC<Props> = (props) => {
    const methods = useForm({ resolver: yupResolver(customerSchema) })
    const AppContext = useAppContext()
    const CustomerContext = useCustomerContext()

    const isDisabled =
        AppContext.isLoading('get-sales-order') ||
        CustomerContext.customers === null

    useEffect(() => {
        methods.setValue('id', CustomerContext.draftCustomer?.id)
        methods.setValue('name', CustomerContext.draftCustomer?.name)
        methods.setValue('phone', CustomerContext.draftCustomer?.phone)
        methods.setValue('email', CustomerContext.draftCustomer?.email)
        methods.setValue('address', CustomerContext.draftCustomer?.address)
    }, [CustomerContext, methods])

    // set on change
    useEffect(() => {
        const subscription = methods.watch(async (data, { name }) => {
            props.clearError && props.clearError()
            if (name === 'id') {
                // replace draft customer with customer data
                const foundCustomer = CustomerContext.customers?.find(
                    (customer) => customer.id === data.id
                )

                if (!foundCustomer) return
                CustomerContext.setDraftCustomer(foundCustomer)
            } else {
                if (await methods.trigger())
                    CustomerContext.setDraftCustomer(data as AddEditCustomerDoc)
            }
        })
        return () => subscription.unsubscribe()
    }, [methods, props, CustomerContext])

    useEffect(() => {
        methods.setError('name', { message: props.error })
    }, [props, methods])

    return isDisabled ? (
        <SalesOrderCustomerFormSkeleton />
    ) : (
        <FormProvider {...methods}>
            <form>
                <div className="flex flex-col gap-2">
                    <Select
                        label="Customer"
                        name="id"
                        options={(CustomerContext.customers || []).map(
                            (customer) => ({
                                value: customer.id,
                                text: customer.name,
                            })
                        )}
                        placeholder="New Customer"
                        helperText="Create or Update customer"
                    />
                    <TextField
                        label="Name"
                        name="name"
                        helperText="Eg. Customer 1"
                    />
                    <TextField
                        label="Email"
                        name="email"
                        helperText="Eg. customer1@gmail.com"
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

export default SalesOrderCustomerForm
