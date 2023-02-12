import React, { useMemo, useState } from 'react'
import * as CustomersAPI from '../../apis/CustomerAPI.ts'
import { useAppContext } from '../AppContext/AppContext'
import * as Types from './types'

const CustomerContext = React.createContext<Types.Context | any>({})

const CustomerContextProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const AppContext = useAppContext()
    const [customers, setCustomers] = useState<Types.Customer[] | null>(null)
    const [selectedCustomer, setSelectedCustomer] =
        useState<Types.Customer | null>(null)
    const [draftCustomer, setDraftCustomer] =
        useState<Types.AddEditCustomerDoc>({
            name: '',
            email: '',
            phone: '',
            address: '',
        })

    const createCustomer: Types.CreateCustomer = async (customerDoc) => {
        const key = 'add-customer'

        AppContext.addLoading(key)
        const response = await CustomersAPI.createCustomer(customerDoc)
        AppContext.removeLoading(key)

        if (!response[0]) {
            AppContext.addNotification({
                title: 'Something went wrong.',
                type: 'danger',
                body: 'Please try again later',
            })
            return [false, response[1].data]
        }

        setCustomers((prev) => [...(prev || []), response[1]])
        return [true, response[1]]
    }

    const updateCustomer: Types.UpdateCustomer = async (id, customerDoc) => {
        const key = 'update-customer'

        AppContext.addLoading(key)
        const response = await CustomersAPI.updateCustomer(id, customerDoc)
        AppContext.removeLoading(key)

        if (!response[0]) {
            return [false, response[1].data]
        }

        // update customers
        setCustomers((prev) =>
            (prev || []).map((customer) => {
                if (customer.id !== id) return customer
                return response[1]
            })
        )

        // update current customer details
        if (id === selectedCustomer?.id) {
            setSelectedCustomer(response[1])
        }

        return [true, response[1]]
    }

    const listCustomers: Types.ListCustomers = async () => {
        const key = 'list-customers'

        AppContext.addLoading(key)
        const response = await CustomersAPI.listCustomers()
        AppContext.removeLoading(key)

        if (!response[0]) {
            AppContext.addNotification({
                title: 'Something went wrong.',
                type: 'danger',
                body: 'Please try again later',
            })
            return response
        }

        setCustomers(response[1])
        return response
    }

    const value: Types.Context = useMemo(
        () => ({
            customers,
            selectedCustomer,
            draftCustomer,
            setDraftCustomer,
            createCustomer,
            updateCustomer,
            listCustomers,
            setSelectedCustomer,
        }),
        [customers, selectedCustomer, draftCustomer]
    )

    return (
        <CustomerContext.Provider value={value}>
            {children}
        </CustomerContext.Provider>
    )
}

const useCustomerContext = () =>
    React.useContext<Types.Context>(CustomerContext)

export { CustomerContext, CustomerContextProvider, useCustomerContext }
