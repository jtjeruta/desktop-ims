import { useEffect, useState } from 'react'
import Button from '../../components/Button/Button'
import Card from '../../components/Card/Card'
import PageHeader from '../../components/PageHeader/PageHeader'
import Table from '../../components/Table/Table'
import UserLayout from '../../components/UserLayout/UserLayout'
import { useAppContext } from '../../contexts/AppContext/AppContext'
import {
    VendorContextProvider,
    useVendorContext,
} from '../../contexts/VendorContext/VendorContext'
import { Vendor } from '../../contexts/VendorContext/types'
import AddEditVendorDialog from '../../components/AddEditVendorDialog/AddEditVendorDialog'

const VendorsPageContent = () => {
    const AppContext = useAppContext()
    const VendorContext = useVendorContext()
    const [search, setSearch] = useState<string>('')

    const filteredVendors = (VendorContext.vendors || []).filter((vendor) => {
        const regex = new RegExp(search, 'igm')
        return [vendor.name, vendor.email, vendor.phone, vendor.address].some(
            (item) => regex.test(`${item}`)
        )
    })

    useEffect(() => {
        async function init() {
            if (VendorContext.vendors === null) {
                await VendorContext.listVendors()
            }
        }

        init()
    }, [VendorContext])

    return (
        <UserLayout>
            <PageHeader
                breadcrumbs={[{ text: 'Vendors' }]}
                searchbar={{ onSearch: (search) => setSearch(search) }}
                buttons={[
                    {
                        text: 'Add Vendor',
                        onClick: () => {
                            VendorContext.setSelectedVendor(null)
                            AppContext.openDialog('add-edit-vendor-dialog')
                        },
                    },
                ]}
            />

            <Card bodyClsx="!px-0 !py-0">
                <Table
                    rows={filteredVendors}
                    loading={AppContext.isLoading('list-vendors')}
                    columns={[
                        {
                            title: 'Name',
                            format: (row) => {
                                const vendor = row as Vendor
                                return vendor.name
                            },
                            sort: (vendor) => vendor.name,
                        },
                        {
                            title: 'Email',
                            format: (row) => {
                                const vendor = row as Vendor
                                return vendor.email
                            },
                            sort: (vendor) => vendor.email,
                        },
                        {
                            title: 'Phone',
                            format: (row) => {
                                const vendor = row as Vendor
                                return vendor.phone
                            },
                            sort: (vendor) => vendor.phone,
                        },
                        {
                            title: 'Address',
                            format: (row) => {
                                const vendor = row as Vendor
                                return vendor.address
                            },
                            sort: (vendor) => vendor.address,
                        },
                        {
                            title: ' ',
                            bodyClsx: 'w-0',
                            format: (row) => {
                                const vendor = row as Vendor
                                return (
                                    <Button
                                        style="link"
                                        onClick={() => {
                                            VendorContext.setSelectedVendor(
                                                vendor
                                            )
                                            AppContext.openDialog(
                                                'add-edit-vendor-dialog'
                                            )
                                        }}
                                    >
                                        Edit
                                    </Button>
                                )
                            },
                        },
                    ]}
                />
            </Card>
            <AddEditVendorDialog />
        </UserLayout>
    )
}

const VendorsPage = () => {
    return (
        <VendorContextProvider>
            <VendorsPageContent />
        </VendorContextProvider>
    )
}

export default VendorsPage
