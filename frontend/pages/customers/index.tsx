import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Button from '../../components/Button/Button'
import Card from '../../components/Card/Card'
import PageHeader from '../../components/PageHeader/PageHeader'
import Table from '../../components/Table/Table'
import UserLayout from '../../components/UserLayout/UserLayout'
import { useAppContext } from '../../contexts/AppContext/AppContext'
import {
    CustomerContextProvider,
    useCustomerContext,
} from '../../contexts/CustomerContext/CustomerContext'
import { Customer } from '../../contexts/CustomerContext/types'

const CustomersPageContent = () => {
    const AppContext = useAppContext()
    const CustomerContext = useCustomerContext()
    const router = useRouter()
    const [search, setSearch] = useState<string>('')

    const filteredCustomers = (CustomerContext.customers || []).filter(
        (customer) => {
            const regex = new RegExp(search, 'igm')
            return [customer.name, customer.email, customer.phone].some(
                (item) => regex.test(`${item}`)
            )
        }
    )

    useEffect(() => {
        async function init() {
            if (CustomerContext.customers === null) {
                await CustomerContext.listCustomers()
            }
        }

        init()
    }, [CustomerContext])

    return (
        <UserLayout>
            <PageHeader
                title="Purchase Customers"
                searchbar={{ onSearch: (search) => setSearch(search) }}
                buttons={[
                    {
                        text: 'Add Customer',
                        onClick: () => router.push('/purchase-customers/new'),
                    },
                ]}
            />

            <Card bodyClsx="!px-0 !py-0">
                <Table
                    rows={filteredCustomers}
                    loading={AppContext.isLoading('list-customers')}
                    columns={[
                        {
                            title: 'Name',
                            format: (row) => {
                                const customer = row as Customer
                                return customer.name
                            },
                            sort: (customer) => customer.name,
                        },
                        {
                            title: 'Email',
                            format: (row) => {
                                const customer = row as Customer
                                return customer.email
                            },
                            sort: (customer) => customer.email,
                        },
                        {
                            title: 'Phone',
                            format: (row) => {
                                const customer = row as Customer
                                return customer.phone
                            },
                            sort: (customer) => customer.phone,
                        },
                        {
                            title: ' ',
                            bodyClsx: 'w-0',
                            format: (row) => {
                                const customer = row as Customer
                                return (
                                    <Button
                                        style="link"
                                        onClick={() =>
                                            router.push(
                                                `/customers/${customer.id}`
                                            )
                                        }
                                    >
                                        View
                                    </Button>
                                )
                            },
                        },
                    ]}
                />
            </Card>
        </UserLayout>
    )
}

const CustomersPage = () => {
    return (
        <CustomerContextProvider>
            <CustomersPageContent />
        </CustomerContextProvider>
    )
}

export default CustomersPage
