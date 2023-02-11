import { FC, useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useAppContext } from '../../contexts/AppContext/AppContext'
import TextField from '../TextField/TextField'
import { useCustomerContext } from '../../contexts/CustomerContext/CustomerContext'
import { AddEditCustomerDoc } from '../../contexts/CustomerContext/types'
import AutoCompleteField from '../AutoCompleteField/AutoCompleteField'
import { useSalesOrderContext } from '../../contexts/SalesOrderContext/SalesOrderContext'

const customerSchema = yup
    .object({
        name: yup.string(),
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
    const SalesOrderContext = useSalesOrderContext()

    const isDisabled =
        AppContext.isLoading('get-sales-order') ||
        CustomerContext.customers === null

    useEffect(() => {
        methods.setValue('id', CustomerContext.draftCustomer?.id)
        methods.setValue('name', CustomerContext.draftCustomer?.name)
        methods.setValue('phone', CustomerContext.draftCustomer?.phone)
        methods.setValue('email', CustomerContext.draftCustomer?.email)
        methods.setValue('address', CustomerContext.draftCustomer?.address)
    }, [
        SalesOrderContext.selectedOrder,
        CustomerContext.draftCustomer,
        methods,
    ])

    useEffect(() => {
        const subscription = methods.watch(async (data, { name }) => {
            props.clearError && props.clearError()
            let customerData = data as AddEditCustomerDoc

            if (name === 'name' && data[name] !== '') {
                const foundCustomer = CustomerContext.customers?.find(
                    (customer) => customer.name === data.name
                )

                if (foundCustomer) {
                    customerData = foundCustomer
                } else {
                    customerData = { ...customerData, id: undefined }
                }
            }

            if (await methods.trigger()) {
                CustomerContext.setDraftCustomer(customerData)
            }
        })
        return () => subscription.unsubscribe()
    }, [methods, props, CustomerContext])

    useEffect(() => {
        methods.setError('name', { message: props.error })
    }, [props, methods])

    return (
        <FormProvider {...methods}>
            <form>
                <div className="flex flex-col gap-2">
                    <AutoCompleteField
                        label="Name"
                        name="name"
                        helperText="Eg. Customer 1"
                        options={
                            CustomerContext.customers?.map((customer) => ({
                                value: customer.id,
                                text: customer.name,
                            })) ?? []
                        }
                        disabled={isDisabled}
                    />
                    <TextField
                        label="Email"
                        name="email"
                        helperText="Eg. customer1@gmail.com"
                        disabled={isDisabled}
                    />
                    <TextField
                        label="Phone"
                        name="phone"
                        helperText="Eg. 09053454665"
                        disabled={isDisabled}
                    />
                    <TextField
                        label="Address"
                        name="address"
                        helperText="Eg. shop 52, San Francisco Village, lapaz, Iloilo City"
                        disabled={isDisabled}
                    />
                </div>
            </form>
        </FormProvider>
    )
}

export default SalesOrderCustomerForm
